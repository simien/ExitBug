import React, { memo } from 'react';
import { TILE_STATUS } from '@/lib/game/constants';
import {
  WallIcon, ExitIcon, EnemyIcon, TrapIcon,
  PotionIcon, ScrollIcon, ShieldIcon, StarIcon, EyeIcon,
  PlayerIcon, FlashlightIcon, FlameIcon, SkullIcon, BombIcon,
  AlarmOffIcon, AlarmOnIcon
} from '@/components/ui/Icons';


// Glassmorphism styles
// Hidden: backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20
// Revealed: bg-white/5 (darker/clearer)
// Mine: Red tint
// Flag: Yellow tint

const Tile = memo(function Tile({ x, y, tile, isPlayer, isBonusTarget, onClick, onContextMenu, id }) {
  const { status, type, content, item } = tile;

  // Base: Sleek, dark, functional
  let baseClasses = "w-10 h-10 md:w-12 md:h-12 border border-white/5 flex items-center justify-center text-xl transition-all duration-300 relative overflow-hidden select-none";

  if (isBonusTarget) {
    baseClasses += " z-10 cursor-crosshair border-amber-500/50 bg-amber-500/10 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]";
  } else if (isPlayer) {
    // Player: Subtle Blue Glow
    baseClasses += " z-20 cursor-default bg-blue-500/20 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-sm";
  } else if (status === TILE_STATUS.HIDDEN) {
    // HIDDEN: Matte Black
    baseClasses += " bg-[#0a0a0a] hover:bg-[#151515] cursor-pointer border-white/5";
  } else {
    // REVEALED
    if (type === 'wall' || status === TILE_STATUS.WALL) {
      // Walls: Distinct Lighter Contrast as requested
      baseClasses += " bg-stone-700/80 border-white/20 cursor-default";
    } else if (type === 'exit') {
      baseClasses += " bg-blue-900/10 border-blue-500/20 cursor-pointer";
    } else if (type === 'enemy') {
      baseClasses += " bg-red-900/10 border-red-500/20 cursor-pointer";
    } else if (type === 'trap') {
      baseClasses += " bg-red-950/20 border-red-900/20 cursor-pointer";
    } else {
      // Empty / Item - Remains dark
      baseClasses += " bg-[#1e1e1e] border-white/5 cursor-pointer hover:bg-[#252525]";
    }
  }

  // Consistent Icon Size & Weight
  // User Requirement: "All icons must be in the same regular weight" & "same size"
  const ICON_SIZE = "w-6 h-6";
  const ICON_WEIGHT = "fill"; // User requested FILL weight for all icons

  // Helper to render specific item icons
  const renderItem = (itm) => {
    switch (itm.id) {
      case 'potion': return <PotionIcon className={`${ICON_SIZE} text-pink-400`} weight={ICON_WEIGHT} />;
      case 'vision_scroll': return <ScrollIcon className={`${ICON_SIZE} text-cyan-300`} weight={ICON_WEIGHT} />;
      case 'shield': return <ShieldIcon className={`${ICON_SIZE} text-blue-300`} weight={ICON_WEIGHT} />;
      case 'smoke_bomb': return <BombIcon className={`${ICON_SIZE} text-gray-400`} weight={ICON_WEIGHT} />;
      default: return <StarIcon className={`${ICON_SIZE} text-yellow-200`} weight={ICON_WEIGHT} />;
    }
  };

  // Content Rendering
  const getContent = () => {
    // 1. Player
    if (isPlayer) return <PlayerIcon className={`${ICON_SIZE} text-blue-400 z-20 drop-shadow-lg`} weight={ICON_WEIGHT} />;

    // 2. Hidden
    if (status === TILE_STATUS.HIDDEN) return null;

    // 3. Revealed Content (Icons)

    // Wall - Lightened Background. Icon brightened.
    if (type === 'wall' || status === TILE_STATUS.WALL) return <WallIcon className={`${ICON_SIZE} text-black opacity-10`} weight={ICON_WEIGHT} />;

    // Torch / Light
    if (status === TILE_STATUS.TORCH_UNLIT) return <FlameIcon className={`${ICON_SIZE} text-stone-400 opacity-70`} weight={ICON_WEIGHT} />;
    if (status === TILE_STATUS.TORCH_LIT) return <FlameIcon className={`${ICON_SIZE} text-amber-500 animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]`} weight={ICON_WEIGHT} />;

    // Skull Decoration
    if (tile.decoration) return <SkullIcon className={`${ICON_SIZE} text-neutral-600 opacity-50`} weight={ICON_WEIGHT} />;

    if (type === 'exit') return <ExitIcon className={`${ICON_SIZE} text-blue-400`} weight={ICON_WEIGHT} />;
    if (type === 'enemy') return <EnemyIcon className={`${ICON_SIZE} text-red-500`} weight={ICON_WEIGHT} />;
    if (type === 'trap') {
      if (content?.type === 'alarm' && content?.status === 'disarmed') return <AlarmOffIcon className={`${ICON_SIZE} text-neutral-500`} weight={ICON_WEIGHT} />;
      if (content?.type === 'alarm' && content?.status === 'triggered') return <AlarmOnIcon className={`${ICON_SIZE} text-red-500 animate-pulse`} weight={ICON_WEIGHT} />;
      return <TrapIcon className={`${ICON_SIZE} text-red-600 opacity-90`} weight={ICON_WEIGHT} />;
    }
    if (item) return renderItem(item);

    return null;
  };

  // Removed WallTexture in favor of WallIcon

  return (
    <div
      id={id}
      className={baseClasses}
      onClick={() => onClick(x, y)}
      onContextMenu={(e) => onContextMenu(e, x, y)}
    >
      {getContent()}
    </div>
  );
});

export default Tile;
