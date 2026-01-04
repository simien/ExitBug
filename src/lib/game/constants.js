export const GRID_SIZE = 12;
export const INITIAL_HP = 3;

// Game State
export const GAME_STATE = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost'
};

// Tile Status
export const TILE_STATUS = {
  HIDDEN: 'hidden',
  REVEALED: 'revealed',
  FLAGGED: 'flagged', // Used for "Scouted" in new mode? Or we add SCOUTED?
  // Let's reuse FLAGGED as visual "Scouted" marker or add SCOUTED.
  // Actually, "Scout" reveals the tile content but keeps it "visited"?
  // Re-read plan: "Revealing tiles before moving... grants safety".
  // So a Scouted tile is REVEALED.
  // But a Blind move reveals it too.
  // Difference is outcome.
  WALL: 'wall',
  TORCH_UNLIT: 'torch_unlit',
  TORCH_LIT: 'torch_lit'
};

// Stealth & Risk Constants
export const ALERT_THRESHOLDS = {
  SAFE: 0,
  AWAKE: 50,
  HUNT: 100
};

export const ENEMY_TYPES = {
  SLEEPER: 'sleeper',
  PATROLLER: 'patroller'
};

export const TRAP_TYPES = {
  SPIKE: 'spike',
  ALARM: 'alarm'
};

export const XP_VALUES = {
  BLIND_MOVE: 10,
  KILL: 50,
  LEVEL_CLEAR: 200
};

export const ALERT_COSTS = {
  SCOUT: 5,
  TRAP_ALARM: 25,
  KILL_NOISE: 15
};

// Rich Item Definitions
export const ITEM_DEFS = {
  POTION: {
    id: 'potion',
    name: "Health Potion",
    icon: "🧪",
    desc: "Heals 1 HP",
    type: 'consumable'
  },
  VISION_SCROLL: {
    id: 'vision_scroll',
    name: "Map Scroll",
    icon: "📜",
    desc: "+1 Vision Radius",
    type: 'permanent'
  },
  SHIELD: {
    id: 'shield',
    name: "Stealth Cloak",
    icon: "🧥",
    desc: "Blocks 1 damage instance",
    type: 'consumable' // Or state modifier
  },
  SMOKE_BOMB: {
    id: 'smoke_bomb',
    name: "Smoke Bomb",
    icon: "💨",
    desc: "-30% Alertness",
    type: 'consumable'
  }
};

export const UPGRADE_COSTS = {
  VISION: { base: 100, inc: 50 },
  HP: { base: 150, inc: 100 },
  STEALTH: { base: 200, inc: 200 }
};

export const LOOT_CHANCE = 0.08;
export const ENEMY_DENSITY = 0.12;
export const TRAP_DENSITY = 0.10;

// Helper to get grid size by floor
export function getGridSize(floor) {
  // Start at 8x8, increase by 1 every floor, cap at 16x16
  return Math.min(16, 8 + (floor - 1));
}
