import React, { useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import Tile from './Tile';
import { isValidBonusTarget } from '@/lib/game/logic';

export default function Board() {
  const { state, dispatch } = useGame();
  const { grid, bonusScout } = state;

  const handleTileClick = useCallback((x, y) => {
    // Intercept for Bonus Scout Mode
    if (bonusScout && bonusScout.active) {
      if (isValidBonusTarget(grid, bonusScout.origin.x, bonusScout.origin.y, x, y)) {
        dispatch({ type: 'SCOUT_TILE', payload: { sx: x, sy: y } });
        return;
      }
    }

    dispatch({ type: 'MOVE_PLAYER', payload: { x, y } });
  }, [bonusScout, grid, dispatch]);

  const handleContextMenu = useCallback((e, x, y) => {
    e.preventDefault();
    dispatch({ type: 'SCOUT_TILE', payload: { sx: x, sy: y } });
  }, [dispatch]);

  if (!grid || grid.length === 0) return <div>Loading Board...</div>;

  return (
    <>
      <div
        className="grid gap-1 bg-black/40 p-2 rounded-lg backdrop-blur-md shadow-2xl border border-white/10"
        style={{ gridTemplateColumns: `repeat(${grid.length}, max-content)` }}
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
    </>
  );
}
