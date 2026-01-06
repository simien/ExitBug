import {
  TILE_STATUS,
  LOOT_CHANCE,
  ITEM_DEFS,
  ENEMY_TYPES,
  TRAP_TYPES,
  ENEMY_DENSITY,
  TRAP_DENSITY,
  ALERT_COSTS,
  XP_VALUES,
  ALERT_THRESHOLDS,
  getGridSize
} from './constants';

function deepCopyBoard(board) {
  return board.map(row => row.map(tile => ({ ...tile })));
}

// Helper to check if a path exists from (sx, sy) to (ex, ey)
function hasPath(grid, sx, sy, ex, ey) {
  const gridSize = grid.length;
  const visited = new Set();
  const queue = [[sx, sy]];
  visited.add(`${sx},${sy}`);

  while (queue.length > 0) {
    const [cx, cy] = queue.shift();
    if (cx === ex && cy === ey) return true;

    const neighbors = [
      [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
        // If not visited AND NOT A WALL
        if (!visited.has(`${nx},${ny}`) && grid[nx][ny].status !== TILE_STATUS.WALL) {
          visited.add(`${nx},${ny}`);
          queue.push([nx, ny]);
        }
      }
    }
  }
  return false;
}

export function createBoard(floor) {
  const gridSize = getGridSize(floor);
  let board = [];
  let validBoard = false;
  let attempts = 0;

  while (!validBoard && attempts < 100) {
    attempts++;
    board = [];
    // Initialize Grid
    for (let x = 0; x < gridSize; x++) {
      const col = [];
      for (let y = 0; y < gridSize; y++) {
        col.push({
          x, y,
          status: TILE_STATUS.HIDDEN,
          type: null,
          item: null,
          content: null, // Keep content structure for enemies/traps
          neighborCount: 0
        });
      }
      board.push(col);
    }

    // 1. Place Walls (20% chance)
    // Keep (0,0) clear
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (x === 0 && y === 0) continue;
        if (Math.random() < 0.20) {
          board[x][y].status = TILE_STATUS.WALL;
        }
      }
    }

    // 2. Place Exit (Far away)
    let exitPlaced = false;
    let exitX, exitY;
    while (!exitPlaced) {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);
      // Don't overwrite start or walls
      if ((x > 2 || y > 2) && board[x][y].status !== TILE_STATUS.WALL) {
        board[x][y].type = 'exit';
        exitX = x; exitY = y;
        exitPlaced = true;
      }
    }

    // 3. Validate Path
    if (hasPath(board, 0, 0, exitX, exitY)) {
      validBoard = true;
    }
  }

  if (!validBoard) {
    console.warn("Failed to generate valid maze, clearing walls.");
    board.forEach(col => col.forEach(tile => {
      if (tile.status === TILE_STATUS.WALL) tile.status = TILE_STATUS.HIDDEN;
    }));
    // Force exit placement if needed, but it should be fine
  }

  // 4. Populate Content
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const tile = board[x][y];
      if (tile.type === 'exit' || (x === 0 && y === 0) || tile.status === TILE_STATUS.WALL) continue;

      const rand = Math.random();

      // Enemies
      if (rand < ENEMY_DENSITY) {
        tile.type = 'enemy';
        tile.content = {
          type: ENEMY_TYPES.SLEEPER,
          hp: 1,
          awake: false
        };
      }
      // Traps
      else if (rand < ENEMY_DENSITY + TRAP_DENSITY) {
        tile.type = 'trap';
        tile.content = {
          type: Math.random() > 0.5 ? TRAP_TYPES.SPIKE : TRAP_TYPES.ALARM
        };
      }
      // Loot
      else if (rand < ENEMY_DENSITY + TRAP_DENSITY + LOOT_CHANCE) {
        const lootRoll = Math.random();
        if (lootRoll < 0.3) tile.item = ITEM_DEFS.POTION;
        else if (lootRoll < 0.5) tile.item = ITEM_DEFS.SMOKE_BOMB;
        else if (lootRoll < 0.7) tile.item = ITEM_DEFS.FLINT;
        else if (lootRoll < 0.8) tile.item = ITEM_DEFS.VISION_SCROLL;
        else if (lootRoll < 0.85) tile.item = ITEM_DEFS.SHIELD;
        else if (lootRoll > 0.95) tile.item = ITEM_DEFS.CURSED_BLADE;
      }
    }
  }

  // Post-process: Convert some Walls to Torches
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (board[x][y].status === TILE_STATUS.WALL) {
        if (Math.random() < 0.1) {
          board[x][y].status = TILE_STATUS.TORCH_UNLIT;
        }
      }
    }
  }

  return board;
}

// BFS Pathfinding (for Click-to-Move)
// Returns array of {x,y} steps or null if no path
export function findPath(grid, startX, startY, targetX, targetY) {
  // Basic checks
  if (!grid[targetX] || !grid[targetX][targetY]) return null;
  if (grid[targetX][targetY].status !== TILE_STATUS.REVEALED) return null; // Can only fast-travel to known tiles
  if (grid[targetX][targetY].status === TILE_STATUS.WALL) return null;

  // BFS
  let queue = [[startX, startY]];
  let visited = new Set();
  visited.add(`${startX},${startY}`);
  let parent = {}; // string key -> {x, y}

  while (queue.length > 0) {
    let [cx, cy] = queue.shift();
    if (cx === targetX && cy === targetY) {
      // Reconstruct Path
      let path = [];
      let curr = `${targetX},${targetY}`;
      while (curr !== `${startX},${startY}`) {
        let [px, py] = curr.split(',').map(Number);
        path.unshift({ x: px, y: py });
        let p = parent[curr];
        curr = `${p.x},${p.y}`;
      }
      return path;
    }

    const neighbors = [
      [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
    ];

    for (let [nx, ny] of neighbors) {
      if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid.length) {
        // Must be REVEALED and NOT WALL to travel through
        // (Unless adjacent to start? No, strictly only discovered paths for fast travel)
        const nTile = grid[nx][ny];
        const key = `${nx},${ny}`;
        if (!visited.has(key) &&
          nTile.status === TILE_STATUS.REVEALED &&
          nTile.status !== TILE_STATUS.WALL) {

          visited.add(key);
          parent[key] = { x: cx, y: cy };
          queue.push([nx, ny]);
        }
      }
    }
  }
  return null;
}

// Action: Scout (Right Click)
export function scoutTile(board, player, x, y) {
  const gridSize = board.length;
  // Bounds check
  if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return { board, alertIncrease: 0 };

  // Range Check (Vision Radius)
  const dx = Math.abs(x - player.x);
  const dy = Math.abs(y - player.y);
  if (dx > player.stats.visionRadius || dy > player.stats.visionRadius) {
    return {
      board,
      alertIncrease: 0,
      message: "Too far to scout!"
    };
  }

  const newBoard = deepCopyBoard(board);
  const tile = newBoard[x][y];

  if (tile.status === TILE_STATUS.REVEALED) {
    return { board, alertIncrease: 0, message: "Already visible." };
  }

  // 1. Reveal Target
  tile.status = TILE_STATUS.REVEALED;
  let message = "Scouted area.";

  // Alert Cost reduces as Vision Radius increases
  // Base 5, -1 per level above 1. Minimum 1.
  let alertCost = Math.max(1, (ALERT_COSTS.SCOUT || 5) - (player.stats.visionRadius - 1));

  // 2. Bonus Potential (Manual Eagle Eye)
  // Logic: Return potential points, context handles the UI mode
  let bonusPoints = 0;
  // Delay bonus until Vision Level 3 (Upgrade 2)
  if (player.stats.visionRadius > 2) {
    bonusPoints = player.stats.visionRadius - 2;
  }

  return {
    board: newBoard,
    alertIncrease: alertCost,
    message: message,
    bonusPoints: bonusPoints // New field
  };
}

export function isValidBonusTarget(board, originX, originY, targetX, targetY) {
  // Must be adjacent (not diagonal for simplicity? or diagonal ok? Let's say adjacency 4-way for strict chain)
  // User said "touching tile". 4-way is standard 'touching'.
  const dx = Math.abs(originX - targetX);
  const dy = Math.abs(originY - targetY);
  const dist = dx + dy;

  if (dist !== 1) return false; // Must be strictly adjacent

  const target = board[targetX][targetY];
  // Must be HIDDEN and NOT WALL
  if (target.status !== TILE_STATUS.HIDDEN) return false;

  return true;
}

// Action: Move / Enter Tile (Left Click)
export function enterTile(board, player, x, y, currentAlert) {
  // 1. Check Move Validity
  const dx = Math.abs(x - player.x);
  const dy = Math.abs(y - player.y);
  if (dx > 1 || dy > 1) return { board, player, alertIncrease: 0 };

  let newBoard = deepCopyBoard(board);
  let newPlayer = { ...player };
  const tile = newBoard[x][y];

  // Wall Collision Check
  if (tile.status === TILE_STATUS.WALL) {
    return {
      board: newBoard,
      player,
      alertIncrease: 0,
      message: "Blocked by Wall."
    };
  }

  // Torch Interaction
  if (tile.status === TILE_STATUS.TORCH_UNLIT) {
    // Check for Flint
    const hasFlint = newPlayer.inventory.some(i => i.id === 'flint');
    if (hasFlint) {
      tile.status = TILE_STATUS.TORCH_LIT;

      // Consume Flint? Let's say yes, stackable?
      // Simplification: Flint is multi-use tool for now?
      // Or consume 1 FLINT.
      const flintIdx = newPlayer.inventory.findIndex(i => i.id === 'flint');
      if (flintIdx > -1) newPlayer.inventory.splice(flintIdx, 1);

      // Reveal Area
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          const tx = x + i;
          const ty = y + j;
          if (tx >= 0 && tx < newBoard.length && ty >= 0 && ty < newBoard.length) {
            if (newBoard[tx][ty].status !== TILE_STATUS.WALL) {
              newBoard[tx][ty].status = TILE_STATUS.REVEALED;
            }
          }
        }
      }

      return {
        board: newBoard,
        player: newPlayer,
        alertIncrease: -10, // Lighting it calms you? Or visual noise?
        message: "Lit Torch! Area Revealed. (-10 Alert)"
      };
    } else {
      return {
        board: newBoard,
        player,
        alertIncrease: 0,
        message: "Unlit Torch. Need Flint to light."
      };
    }
  }

  // Lit Torch is impassable furniture? Or walk through?
  if (tile.status === TILE_STATUS.TORCH_LIT) {
    return { board, player, alertIncrease: 0, message: "Warmth radiates from the torch." };
  }

  let alertIncrease = 0;
  let damage = 0;
  let message = "";
  let levelComplete = false;

  const isBlind = tile.status === TILE_STATUS.HIDDEN;

  // Reveal
  tile.status = TILE_STATUS.REVEALED;
  newPlayer.x = x;
  newPlayer.y = y;

  if (tile.type === 'exit') {
    levelComplete = true;
    message = "Found the Exit!";
    return { board: newBoard, player: newPlayer, alertIncrease, damage, message, levelComplete };
  }

  // Handle Content
  if (tile.type === 'enemy') {
    const enemy = tile.content;
    const isAwake = enemy.awake || currentAlert >= ALERT_THRESHOLDS.AWAKE;

    if (isAwake) {
      // Combat Dice Roll
      const roll = Math.floor(Math.random() * 20) + 1;
      const bonus = newPlayer.stats.attackBonus || 0;
      const total = roll + bonus;
      const enemyDC = 10; // Base Difficulty. Could scale with floor?

      if (total >= enemyDC) {
        // Success!
        message = `Combat: Rolled ${roll} + ${bonus} = ${total} (vs ${enemyDC}). Enemy Defeated!`;
        // Enemy dies (logic below handles cleanup)
        newPlayer.xp += 10; // Bonus XP for waking kill?
      } else {
        // Failure
        message = `Combat: Rolled ${roll} + ${bonus} = ${total} (vs ${enemyDC}). Missed!`;

        // 1. Check Passive Block (Shield Skill)
        const shieldLevel = newPlayer.stats.shieldLevel || 0;
        const blockChance = shieldLevel * 0.10; // 10% per level

        if (Math.random() < blockChance) {
          message += " Passive Shield blocked the hit!";
        }
        // 2. Check Active Shield (Item)
        else if (newPlayer.stats.shield) {
          newPlayer.stats.shield = false;
          message += " Stealth Cloak blocked the counter-attack!";
        } else {
          damage = 1;
          message += " You took damage.";
        }
        alertIncrease += ALERT_COSTS.KILL_NOISE || 10;
      }
    } else {
      message = "Silenced enemy in sleep. (Auto-Crit)";
      // Bonus XP for assassination?
      newPlayer.xp += 15;
    }

    tile.type = 'empty';
    tile.content = null;
    tile.decoration = '💀';
    newPlayer.xp += XP_VALUES.KILL;

  } else if (tile.type === 'trap') {
    if (tile.content.type === TRAP_TYPES.SPIKE) {
      damage = 1;
      message = "Stepped on Spikes!";
    } else if (tile.content.type === TRAP_TYPES.ALARM) {
      // Stealth Dice Roll
      const roll = Math.floor(Math.random() * 20) + 1;
      const bonus = newPlayer.stats.stealth || 0;
      const total = roll + bonus;
      const alarmDC = 12; // Base Difficulty

      if (total >= alarmDC) {
        message = `Alarm Disarmed! (Rolled ${roll} + ${bonus} = ${total} vs ${alarmDC})`;
        // No alert increase
        tile.content.status = 'disarmed';
      } else {
        alertIncrease += ALERT_COSTS.TRAP_ALARM || 20;
        message = `ALARM TRIGGERED! (Rolled ${roll} + ${bonus} = ${total} vs ${alarmDC})`;
        tile.content.status = 'triggered';
      }
      // Do NOT clear tile for alarms, so we can see the icon
    } else {
      // Spikes or others still clear
      tile.type = 'empty';
      tile.content = null;
    }
  }

  // Loot Pickup & Effects
  if (tile.item) {
    message = `Found ${tile.item.name}!`; // Will now be "Found Health Potion!"

    // Immediate Effects
    if (tile.item.id === 'potion') {
      if (newPlayer.hp < newPlayer.maxHp) {
        newPlayer.hp += 1;
        message += " HP Restored.";
      } else {
        message += " HP Full.";
      }
      newPlayer.inventory.push({ id: 'potion', name: 'Health Potion' });
    } else if (tile.item.id === 'vision_scroll') {
      // Scrolls now just give small XP or Temp vision?
      // Or maybe they stay as permanent upgrades found in dungeon?
      // Let's keep them as free permanent upgrades for lucky finds!
      if (!newPlayer.stats.visionRadius) newPlayer.stats.visionRadius = 1;
      newPlayer.stats.visionRadius += 1;
      message += " Vision Radius Increased!";
      newPlayer.inventory.push({ id: 'vision_scroll', name: 'Vision Scroll', description: 'Reveals area' });
    } else if (tile.item.id === 'shield') {
      newPlayer.stats.shield = true;
      message += " Obtained Stealth Cloak.";
      // Also add to inventory or just stat? The previous logic pushed to inventory AND set stat?
      // "Stealth Cloak" item.
      newPlayer.inventory.push({ id: 'shield', name: 'Stealth Cloak', description: 'Blocks 1 hit' });
    } else if (tile.item.id === 'smoke_bomb') {
      message += " Obtained Smoke Bomb.";
      newPlayer.inventory.push({ id: 'smoke_bomb', name: 'Smoke Bomb', description: '-30 Alertness' });
    } else if (tile.item.id === 'flint') {
      message += " Obtained Flint & Steel.";
      newPlayer.inventory.push({ id: 'flint', name: 'Flint & Steel', description: 'Lights Torches' });
    } else if (tile.item.id === 'cursed_blade') {
      newPlayer.stats.attackBonus += 2;
      message += " You feel a dark power. (+2 Attack)";
      newPlayer.inventory.push({ id: 'cursed_blade', name: 'Cursed Blade', description: '+2 Attack' });
    }

    // Remove item from tile after pickup
    tile.item = null;
  }

  if (isBlind && damage === 0) {
    newPlayer.xp += XP_VALUES.BLIND_MOVE;
  }

  newPlayer.hp -= damage;

  return { board: newBoard, player: newPlayer, alertIncrease, damage, message, levelComplete };
}

// Check Win/Loss isn't static anymore, managed by GameContext state transitions
// eslint-disable-next-line no-unused-vars
export function checkWinCondition(_grid) { return false; }
