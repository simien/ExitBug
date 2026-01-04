import { ITEM_TYPES } from './constants';

export const ITEMS = {
  [ITEM_TYPES.POTION]: {
    id: ITEM_TYPES.POTION,
    name: 'Health Potion',
    description: 'Restores 1 HP',
    icon: '❤️',
    effect: (player) => ({ ...player, hp: Math.min(player.hp + 1, player.maxHp) })
  },
  [ITEM_TYPES.VISION_SCROLL]: {
    id: ITEM_TYPES.VISION_SCROLL,
    name: 'Vision Scroll',
    description: 'Increases Vision Radius by 1',
    icon: '📜',
    effect: (player) => ({ ...player, stats: { ...player.stats, visionRadius: player.stats.visionRadius + 1 } })
  },
  [ITEM_TYPES.SHIELD]: {
    id: ITEM_TYPES.SHIELD,
    name: 'Shield',
    description: 'Blocks next trap damage',
    icon: '🛡️',
    effect: (player) => ({ ...player, stats: { ...player.stats, shield: true } })
  }
};
