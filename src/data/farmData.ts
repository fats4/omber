import type { FlatCoord } from '../game/world/flatCoords';
import { FARMHOUSE_POSITION } from './stories';

export { FARMHOUSE_POSITION };

export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type FarmTool = 'hoe' | 'watering' | 'seeds' | 'basket';
export type TileState = 'grass' | 'tilled' | 'planted' | 'ready';

export interface FarmTile {
  row: number;
  col: number;
  coord: FlatCoord;
  state: TileState;
  growthStage: number;
  watered: boolean;
}

export const FARM_ROWS = 4;
export const FARM_COLS = 3;
export const TILE_SPACING = 0.85;
export const FARM_ORIGIN: FlatCoord = { x: 0, z: 2.2 };

export const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter'];

export const SEASON_LABELS: Record<Season, string> = {
  spring: 'Musim Semi',
  summer: 'Musim Panas',
  fall: 'Musim Gugur',
  winter: 'Musim Dingin',
};

export const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] as const;

export const TOOL_ORDER: FarmTool[] = ['hoe', 'watering', 'seeds', 'basket'];

export const TOOL_LABELS: Record<FarmTool, string> = {
  hoe: 'Cangkul',
  watering: 'Penyiram',
  seeds: 'Benih',
  basket: 'Keranjang',
};

export const CROP_COLORS: Record<string, string> = {
  'shadow-denim': '#3d4f7c',
  'vortex-cap': '#2d6a4f',
  'blind-box': '#7c3aed',
  'domination-bag': '#5d40ff',
};

export const DAY_START_MINUTES = 360;
export const DAY_END_MINUTES = 1140;
export const MINUTES_PER_REAL_SECOND = 4;
export const MAX_STAMINA = 100;
export const GROWTH_STAGES = 3;

export function createFarmTiles(): FarmTile[] {
  const tiles: FarmTile[] = [];
  const colCenter = (FARM_COLS - 1) / 2;
  const rowCenter = (FARM_ROWS - 1) / 2;

  for (let row = 0; row < FARM_ROWS; row += 1) {
    for (let col = 0; col < FARM_COLS; col += 1) {
      tiles.push({
        row,
        col,
        coord: {
          x: FARM_ORIGIN.x + (col - colCenter) * TILE_SPACING,
          z: FARM_ORIGIN.z + (row - rowCenter) * TILE_SPACING,
        },
        state: 'grass',
        growthStage: 0,
        watered: false,
      });
    }
  }

  return tiles;
}

export function formatGameTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${period} ${hour12}:${m.toString().padStart(2, '0')}`;
}

export function formatHmDate(day: number): string {
  return `${day} ${WEEKDAYS[(day - 1) % WEEKDAYS.length]}`;
}
