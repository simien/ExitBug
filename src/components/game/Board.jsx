import React, { useCallback, useRef, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import Tile from './Tile';
import { isValidBonusTarget } from '@/lib/game/logic';

export default function Board() {
  const { state, dispatch } = useGame();
  const { grid, bonusScout } = state;

  // ⚡ Bolt Optimization: Use ref to access latest state in callbacks without triggering re-creation
  // This prevents handleTileClick from changing when grid/bonusScout updates,
  // allowing React.memo in Tile to work effectively for unchanged tiles.
  const stateRef = useRef({ grid, bonusScout });

  // Keep ref synced with latest state
  useEffect(() => {
    stateRef.current = { grid, bonusScout };
  });

  const handleTileClick = useCallback((x, y) => {
    const { grid: currentGrid, bonusScout: currentBonusScout } = stateRef.current;

    // Intercept for Bonus Scout Mode
    if (currentBonusScout && currentBonusScout.active) {
      if (isValidBonusTarget(currentGrid, currentBonusScout.origin.x, currentBonusScout.origin.y, x, y)) {
        dispatch({ type: 'SCOUT_TILE', payload: { sx: x, sy: y } });
        return;
      }
    }

    dispatch({ type: 'MOVE_PLAYER', payload: { x, y } });
  }, [dispatch]);

  const handleContextMenu = useCallback((e, x, y) => {
    e.preventDefault();
    dispatch({ type: 'SCOUT_TILE', payload: { sx: x, sy: y } });
  }, [dispatch]);

  if (!grid || grid.length === 0) return <div>Loading Board...</div>;

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
                x={x}
                y={y}
                tile={tile}
                isPlayer={state.player && state.player.x === x && state.player.y === y}
                isBonusTarget={isBonusTarget}
                onClick={handleTileClick}
                onContextMenu={handleContextMenu}
              />
            );
          })
        ))}
      </div>
    </div>
  );
}
