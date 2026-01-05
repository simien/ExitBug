import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { createBoard, enterTile, scoutTile, findPath, isValidBonusTarget } from '@/lib/game/logic';
import { GRID_SIZE, INITIAL_HP, GAME_STATE } from '@/lib/game/constants';

const GameContext = createContext();



const getInitialState = () => ({
  grid: [],
  player: {
    hp: INITIAL_HP,
    maxHp: INITIAL_HP,
    score: 0,
    xp: 0,
    level: 1,
    x: 0,
    y: 0,
    stats: {
      visionRadius: 1,
      visionProgress: 0,
      attackBonus: 0,
      attackProgress: 0,

      shield: false,
      shieldLevel: 0,
      shieldProgress: 0,

      stealth: 0
    },
    inventory: []
  },
  bonusScout: { // New state for interactive mode
    active: false,
    points: 0,
    origin: null
  },
  alertness: 0,
  floor: 1,
  gameState: GAME_STATE.PLAYING,
  message: "Welcome to ExitBug. Stay quiet..."
});

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      const freshState = getInitialState();
      return {
        ...freshState,
        grid: createBoard(1)
      };
    }

    case 'SCOUT_TILE': {
      if (state.gameState !== GAME_STATE.PLAYING) return state;
      const { sx, sy } = action.payload;

      // Case A: BONUS MODE ACTIVE (Player clicking neighbor)
      if (state.bonusScout && state.bonusScout.active) {
        // Validate target
        // Using imported helper
        if (isValidBonusTarget(state.grid, state.bonusScout.origin.x, state.bonusScout.origin.y, sx, sy)) {
          // Reveal this tile
          let newGrid = [...state.grid];
          // Deep copy column? state.grid is array of cols
          // Technically we need deep copy of grid to be pure?
          // logic.js's scoutTile does deepCopyBoard. We should probably do it here or make a helper.
          // For performance, let's just copy the column or cheat slightly if React works.
          // Better to be safe:
          newGrid = newGrid.map(col => [...col]);
          newGrid[sx][sy] = { ...newGrid[sx][sy], status: 2 }; // REVEALED = 2. Ideally import constant.

          const newPoints = state.bonusScout.points - 1;
          const newActive = newPoints > 0;

          return {
            ...state,
            grid: newGrid,
            bonusScout: {
              ...state.bonusScout,
              points: newPoints,
              active: newActive,
              // If still points, update origin to NEW tile?
              // "Choose a touching tile".
              // Usually implies chain from *original* scout or *new* scout?
              // "Touching tile" implies touching the LAST revealed tile or the ORIGINAL?
              // Let's assume chaining is allowed (touching the just-revealed tile).
              origin: { x: sx, y: sy }
            },
            message: `revealed! ${newPoints} focus left.`
          };
        } else {
          // Invalid click in bonus mode?
          // Maybe they want to Click FAR away to start a NEW regular scout?
          // If they click invalid target, we might treat it as a NEW SCout attempt?
          // But that would burn Alertness.
          // Let's just say "Invalid Target" or ignore.
          return { ...state, message: "Select a touching hidden tile." };
        }
      }

      // Case B: NORMAL SCOUT (Start of chain)
      const scoutResult = scoutTile(state.grid, state.player, sx, sy);

      if (scoutResult.alertIncrease === 0 && !scoutResult.bonusPoints) return state;
      // Note: If alert 0 but bonusPoints exist? Impossible since scoutTile returns 0 alert only on failure.

      let nextBonusState = { active: false, points: 0, origin: null };
      if (scoutResult.bonusPoints > 0) {
        nextBonusState = {
          active: true,
          points: scoutResult.bonusPoints,
          origin: { x: sx, y: sy }
        };
      }

      return {
        ...state,
        grid: scoutResult.board,
        alertness: Math.min(100, state.alertness + scoutResult.alertIncrease),
        message: scoutResult.message + (scoutResult.bonusPoints > 0 ? " Eagle Eye Active!" : ""),
        bonusScout: nextBonusState
      };
    }

    case 'CANCEL_SCOUT':
      return {
        ...state,
        bonusScout: { active: false, points: 0, origin: null },
        message: "Focus lost."
      };

    case 'MOVE_PLAYER': {
      if (state.gameState !== GAME_STATE.PLAYING) return state;
      const { x, y } = action.payload;

      // Calculate distance
      const dx = Math.abs(x - state.player.x);
      const dy = Math.abs(y - state.player.y);

      let steps = [];

      if (dx <= 1 && dy <= 1) {
        // Direct Move
        steps.push({ x, y });
      } else {
        // Pathfinding Move
        const path = findPath(state.grid, state.player.x, state.player.y, x, y);
        if (path) {
          steps = path; // Array of {x,y}
        } else {
          // Invalid path (too far and not revealed)
          return state;
        }
      }

      // Execute Steps Sequence
      let currentState = {
        ...state,
        bonusScout: { active: false, points: 0, origin: null } // Reset Bonus Scout on any move
      };

      for (const step of steps) {
        // Break if dead or level complete from previous step (though entering subsequent tiles might be weird logic, let's process typically)
        if (currentState.gameState === GAME_STATE.LOST) break;
        // Actually, if level complete, we stop processing further steps immediately?
        // Yes.

        const result = enterTile(currentState.grid, currentState.player, step.x, step.y, currentState.alertness);

        currentState.grid = result.board;
        currentState.player = result.player;
        currentState.alertness = Math.min(100, currentState.alertness + result.alertIncrease);
        currentState.message = result.message;

        if (currentState.player.hp <= 0) {
          currentState.gameState = GAME_STATE.LOST;
          currentState.message = "You died in the darkness.";
          break;
        }
        if (result.levelComplete) {
          // Level Transition Logic
          currentState.floor += 1;
          currentState.grid = createBoard(currentState.floor);
          currentState.player.x = 0;
          currentState.player.y = 0;
          currentState.alertness = Math.max(0, currentState.alertness - 20);
          currentState.bonusScout = { active: false, points: 0, origin: null }; // Reset Bonus State
          currentState.message = "Floor Cleared! Descending deeper...";
          break;
        }
      }

      return currentState;
    }

    case 'UPGRADE_STAT': {
      const { stat, cost } = action.payload;
      if (state.player.xp < cost) return state;

      let upgradedPlayer = { ...state.player };
      let upgradeMsg = "";

      if (stat === 'VISION') {
        // Proficiency System
        // Threshold = Current Level (Level 1 needs 1 pt, Level 2 needs 2 pts, etc)
        const currentLevel = upgradedPlayer.stats.visionRadius;
        const threshold = currentLevel;

        upgradedPlayer.xp -= cost;
        upgradedPlayer.stats.visionProgress += 1;

        if (upgradedPlayer.stats.visionProgress >= threshold) {
          // Level Up!
          upgradedPlayer.stats.visionRadius += 1;
          upgradedPlayer.stats.visionProgress = 0;
          upgradeMsg = `Eagle Eye Level Up! (Lvl ${upgradedPlayer.stats.visionRadius})`;
        } else {
          // Just Progress
          upgradeMsg = `Eagle Eye Improved. (${upgradedPlayer.stats.visionProgress}/${threshold})`;
        }

      } else if (stat === 'HP') {
        upgradedPlayer.xp -= cost;
        upgradedPlayer.maxHp += 1;
        upgradedPlayer.hp += 1;
        upgradeMsg = "Max HP Increased!";
      } else if (stat === 'STEALTH') {
        upgradedPlayer.xp -= cost;
        upgradedPlayer.stats.stealth = (upgradedPlayer.stats.stealth || 0) + 1;
        upgradeMsg = "Stealth Upgraded! Better odds vs traps.";

      } else if (stat === 'ATTACK') {
        const currentLevel = upgradedPlayer.stats.attackBonus;
        // Threshold scales with level (0->1, 1->2, etc). Let's use simple level-based threshold.
        // Level 0 requires 1 progress to reach Level 1? Or just flat?
        // Let's match Vision: threshold = currentLevel + 1 (to make it harder?)
        // Vision uses `threshold = currentLevel` (line 204). at lvl 1, 1 pt to lvl 2.
        const threshold = Math.max(1, currentLevel);

        upgradedPlayer.xp -= cost;
        upgradedPlayer.stats.attackProgress = (upgradedPlayer.stats.attackProgress || 0) + 1;

        if (upgradedPlayer.stats.attackProgress >= threshold) {
          upgradedPlayer.stats.attackBonus += 1;
          upgradedPlayer.stats.attackProgress = 0;
          upgradeMsg = `Strength Increased! (+${upgradedPlayer.stats.attackBonus} Attack)`;
        } else {
          upgradeMsg = `Strength Improved. (${upgradedPlayer.stats.attackProgress}/${threshold})`;
        }

      } else if (stat === 'SHIELD') {
        const currentLevel = upgradedPlayer.stats.shieldLevel || 0;
        const threshold = Math.max(1, currentLevel);

        upgradedPlayer.xp -= cost;
        upgradedPlayer.stats.shieldProgress = (upgradedPlayer.stats.shieldProgress || 0) + 1;

        if (upgradedPlayer.stats.shieldProgress >= threshold) {
          upgradedPlayer.stats.shieldLevel = (upgradedPlayer.stats.shieldLevel || 0) + 1;
          upgradedPlayer.stats.shieldProgress = 0;
          upgradeMsg = `Defense Increased! (${upgradedPlayer.stats.shieldLevel * 10}% Block Chance)`;
        } else {
          upgradeMsg = `Defense Improved. (${upgradedPlayer.stats.shieldProgress}/${threshold})`;
        }
      }

      return {
        ...state,
        player: upgradedPlayer,
        message: upgradeMsg
      };
    }

    default:
      return state;
  }
}



export function GameProvider({ children, user }) {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());

  useEffect(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  useEffect(() => {
    const saveScore = () => {
      // Only save on loss (end of run)
      if (state.gameState === GAME_STATE.LOST) {
        if (user) {
          try {
            const newScore = {
              userId: user.uid,
              displayName: user.displayName || user.email.split('@')[0],
              score: state.player.xp,
              floor: state.floor,
              createdAt: new Date().toISOString()
            };

            const existingScores = JSON.parse(localStorage.getItem('hiddenGame_scores') || '[]');
            existingScores.push(newScore);
            // Optional: Sort and keep top 10 locally?
            existingScores.sort((a, b) => b.score - a.score);

            localStorage.setItem('hiddenGame_scores', JSON.stringify(existingScores));
            console.log("Run saved locally!");
          } catch (e) {
            console.error("Error saving score locally:", e);
          }
        }
      }
    };
    saveScore();
  }, [state.gameState, user, state.player.xp, state.floor]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
