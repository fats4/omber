/** Path GLB di folder public/models/ — taruh file .glb di sana */
export const GAME_MODELS = {
  player: '/models/player.glb',
  farmhouse: '/models/farmhouse.glb',
  npc: '/models/npc.glb',
} as const;

/**
 * Aktifkan setelah file GLB ada di public/models/.
 * Contoh: salin player.glb → public/models/player.glb lalu set player: true
 */
export const LOAD_GLB_MODELS: Record<keyof typeof GAME_MODELS, boolean> = {
  player: true,
  farmhouse: false,
  npc: false,
};

/** Nama clip animasi di player.glb (Meshy merged animations) */
export const PLAYER_ANIMATIONS = {
  walk: 'Walking',
  run: 'Running',
} as const;

/** Skala & offset default per model (sesuaikan setelah import) */
export const MODEL_SETTINGS = {
  player: { targetHeight: 1.05, yOffset: 0, rotationY: Math.PI },
  farmhouse: { targetHeight: 3.2, yOffset: 0, rotationY: 0 },
  npc: { targetHeight: 2.4, yOffset: 0, rotationY: 0 },
} as const;
