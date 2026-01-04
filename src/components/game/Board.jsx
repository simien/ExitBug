import React from 'react';
import { useGame } from '@/context/GameContext';
import Tile from './Tile';
import { isValidBonusTarget } from '@/lib/game/logic';

export default function Board() {
  const { state, dispatch } = useGame();
  const { grid, bonusScout } = state;

  if (!grid || grid.length === 0) return <div>Loading Board...</div>;

  // const { player } = state;

  const handleTileClick = (x, y) => {
    // Intercept for Bonus Scout Mode
    if (bonusScout && bonusScout.active) {
      if (isValidBonusTarget(grid, bonusScout.origin.x, bonusScout.origin.y, x, y)) {
        dispatch({ type: 'SCOUT_TILE', payload: { sx: x, sy: y } });
        return;
      }
      // If clicking invalid tile in bonus mode, maybe just do nothing or let move happen if it's revealed?
      // If clicking REVEALED tile in bonus mode -> Move normally?
      // Yes, let player move while in bonus mode.
    }

    dispatch({ type: 'MOVE_PLAYER', payload: { x, y } });
  };

  const handleContextMenu = (e, x, y) => {
    e.preventDefault();
    dispatch({ type: 'SCOUT_TILE', payload: { sx: x, sy: y } });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className="grid gap-1 bg-black/40 p-2 rounded-lg backdrop-blur-md shadow-2xl border border-white/10"
        style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}
      >
        {grid.map((row, x) => (
          row.map((tile, y) => {
            let isBonusTarget = false;
            if (bonusScout && bonusScout.active) {
              isBonusTarget = isValidBonusTarget(grid, bonusScout.origin.x, bonusScout.origin.y, x, y);
            }

            return (
              <Tile
                key={`${x}-${y}`}
                tile={tile}
                isPlayer={state.player && state.player.x === x && state.player.y === y}
                isBonusTarget={isBonusTarget}
                onClick={() => handleTileClick(x, y)}
                onContextMenu={(e) => handleContextMenu(e, x, y)}
              />
            );
          })
        ))}
      </div>
    </div>
  );
}
