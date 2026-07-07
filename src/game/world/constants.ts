export const PLANET_RADIUS = 12;
/** Jarak anchor di atas mesh planet — cegah clipping di permukaan lengkung */
export const SURFACE_ANCHOR_OFFSET = 0.12;
export const CHARACTER_SURFACE_OFFSET = SURFACE_ANCHOR_OFFSET;
/** Kecepatan jalan di permukaan (unit/detik) */
export const PLAYER_MOVE_SPEED = 2.1;

/** Arah WASD relatif kamera isometrik (selaras ISO_OFFSET 11,13,11) */
const ISO = 1 / Math.SQRT2;
export const CAM_MOVE_FORWARD = { x: -ISO, z: -ISO };
export const CAM_MOVE_RIGHT = { x: ISO, z: -ISO };
export const INTERACT_RADIUS = 2.6;

export const COLORS = {
  sky: '#9ec9e8',
  skyHorizon: '#d4e8f7',
  fog: '#b8d4ea',
  grass: '#7cb342',
  grassLight: '#9ccc65',
  grassDark: '#558b2f',
  path: '#c4a574',
  pathDark: '#a08860',
  water: '#5dade2',
  waterDeep: '#3498db',
  cliff: '#9bb38a',
  outline: '#3e2723',
  purple: '#5d40ff',
  purpleDark: '#4a32cc',
  green: '#26ff71',
  greenDark: '#1ed95f',
  cream: '#fff8e7',
  warmLight: '#fff4df',
  npcDefault: '#faf8f5',
  npcDone: '#b0bec9',
  playerBody: '#2c3e50',
  playerHead: '#ffcc80',
  playerHair: '#5d4037',
  package: '#5d40ff',
  wood: '#8d6e63',
  rock: '#94a3b8',
  hudBg: '#fff8e7',
  hudBorder: '#8d6e63',
} as const;

export const FLAT_MAT = {
  flatShading: true,
  roughness: 0.92,
  metalness: 0,
} as const;

export const NPC_ACCENTS: Record<string, string> = {
  'shadow-denim': '#3d4f7c',
  'vortex-cap': '#2d6a4f',
  'blind-box': '#7c3aed',
  'domination-bag': '#5d40ff',
};
