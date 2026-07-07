import type { FarmTile } from '../../data/farmData';
import { CROP_COLORS } from '../../data/farmData';
import type { StoryQuest } from '../../data/stories';
import { COLORS, FLAT_MAT } from './constants';
import { FlatAnchor } from './FlatAnchor';

interface FarmFieldProps {
  tiles: FarmTile[];
  currentQuest: StoryQuest | null;
}

function tileColor(tile: FarmTile, cropId: string | undefined): string {
  if (tile.state === 'grass') return '#6d8b4a';
  if (tile.state === 'tilled') return '#8b6914';
  if (tile.state === 'ready') return '#ffd54f';
  if (tile.state === 'planted') {
    const base = cropId ? CROP_COLORS[cropId] ?? COLORS.greenDark : COLORS.greenDark;
    if (tile.growthStage >= 2) return base;
    if (tile.growthStage >= 1) return COLORS.grass;
    return '#6b8f71';
  }
  return COLORS.grass;
}

function tileHeight(tile: FarmTile): number {
  if (tile.state === 'ready') return 0.35;
  if (tile.state === 'planted') return 0.08 + tile.growthStage * 0.1;
  if (tile.state === 'tilled') return 0.03;
  return 0;
}

function FarmTileMesh({ tile, cropId }: { tile: FarmTile; cropId: string | undefined }) {
  const height = tileHeight(tile);
  const color = tileColor(tile, cropId);

  return (
    <FlatAnchor coord={tile.coord}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[0.72, 0.72]} />
        <meshStandardMaterial
          color={tile.state === 'tilled' ? '#7a5230' : tile.state === 'grass' ? '#5a7a38' : '#6d8b4a'}
          {...FLAT_MAT}
        />
      </mesh>

      {(tile.state === 'tilled' || tile.state === 'planted' || tile.state === 'ready') && height > 0 && (
        <mesh castShadow position={[0, height / 2 + 0.02, 0]}>
          {tile.state === 'ready' ? (
            <sphereGeometry args={[0.14, 8, 8]} />
          ) : tile.growthStage >= 1 ? (
            <coneGeometry args={[0.1, height, 5]} />
          ) : (
            <boxGeometry args={[0.06, height, 0.06]} />
          )}
          <meshStandardMaterial color={color} {...FLAT_MAT} />
        </mesh>
      )}

      {tile.watered && tile.state === 'planted' && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.12, 10]} />
          <meshStandardMaterial color={COLORS.water} transparent opacity={0.6} {...FLAT_MAT} />
        </mesh>
      )}
    </FlatAnchor>
  );
}

export function FarmField({ tiles, currentQuest }: FarmFieldProps) {
  return (
    <group>
      {tiles.map((tile) => (
        <FarmTileMesh key={`${tile.row}-${tile.col}`} tile={tile} cropId={currentQuest?.id} />
      ))}
    </group>
  );
}
