import { COLORS, FLAT_MAT, PLANET_RADIUS } from './constants';
import { SurfaceAnchor } from './SurfaceAnchor';
import type { SphericalCoord } from './sphereCoords';

function SurfaceTree({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <mesh castShadow position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.7, 6]} />
        <meshStandardMaterial color={COLORS.wood} {...FLAT_MAT} />
      </mesh>
      <mesh castShadow position={[0, 0.85, 0]}>
        <coneGeometry args={[0.35, 0.75, 6]} />
        <meshStandardMaterial color="#6b8f71" {...FLAT_MAT} />
      </mesh>
    </group>
  );
}

function SurfaceRock({ scale = 1 }: { scale?: number }) {
  return (
    <mesh castShadow position={[0, 0.18 * scale, 0]} scale={scale}>
      <dodecahedronGeometry args={[0.22, 0]} />
      <meshStandardMaterial color={COLORS.rock} {...FLAT_MAT} />
    </mesh>
  );
}

const SCATTER: { coord: SphericalCoord; kind: 'tree' | 'rock'; scale?: number }[] = [
  { coord: { theta: 0.1, phi: 1.35 }, kind: 'tree', scale: 0.9 },
  { coord: { theta: 1.4, phi: 1.25 }, kind: 'tree', scale: 1.05 },
  { coord: { theta: -1.2, phi: 1.65 }, kind: 'tree', scale: 0.85 },
  { coord: { theta: 2.4, phi: 1.45 }, kind: 'tree' },
  { coord: { theta: 0.9, phi: 2.1 }, kind: 'rock', scale: 1.1 },
  { coord: { theta: -0.5, phi: 1.9 }, kind: 'rock' },
  { coord: { theta: 1.8, phi: 1.95 }, kind: 'rock', scale: 0.8 },
];

export function Planet() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
        <meshStandardMaterial color={COLORS.grass} {...FLAT_MAT} />
      </mesh>

      <mesh>
        <sphereGeometry args={[PLANET_RADIUS + 0.08, 48, 48]} />
        <meshStandardMaterial
          color={COLORS.water}
          transparent
          opacity={0.12}
          {...FLAT_MAT}
        />
      </mesh>

      {SCATTER.map(({ coord, kind, scale }) => (
        <SurfaceAnchor key={`${coord.theta}-${coord.phi}`} coord={coord}>
          {kind === 'tree' ? <SurfaceTree scale={scale} /> : <SurfaceRock scale={scale} />}
        </SurfaceAnchor>
      ))}
    </group>
  );
}
