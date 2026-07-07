import { COLORS, FLAT_MAT } from './constants';

const FENCE_POSTS: [number, number][] = [
  [-2.2, 0.4], [-0.8, 0.4], [0.8, 0.4], [2.2, 0.4],
  [-2.2, 1.8], [-0.8, 1.8], [0.8, 1.8], [2.2, 1.8],
  [-2.2, 3.2], [-0.8, 3.2], [0.8, 3.2], [2.2, 3.2],
];

const TREES: [number, number, number][] = [
  [-14, -10, 1.1], [16, -12, 0.9], [-12, 14, 1], [14, 11, 1.15], [0, -16, 0.85],
];

export function FarmWorld() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[52, 52]} />
        <meshStandardMaterial color={COLORS.grassLight} {...FLAT_MAT} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, 0.01, 6]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={COLORS.grass} {...FLAT_MAT} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.01, -4]} receiveShadow>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#c8b878" {...FLAT_MAT} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, -20]} receiveShadow>
        <planeGeometry args={[52, 14]} />
        <meshStandardMaterial color={COLORS.water} {...FLAT_MAT} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -13]} receiveShadow>
        <planeGeometry args={[52, 2.5]} />
        <meshStandardMaterial color={COLORS.path} {...FLAT_MAT} />
      </mesh>

      {FENCE_POSTS.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.22, z]} castShadow>
          <boxGeometry args={[0.12, 0.44, 0.12]} />
          <meshStandardMaterial color={COLORS.wood} {...FLAT_MAT} />
        </mesh>
      ))}

      {[[-2.2, 1.1], [2.2, 1.1], [-2.2, 2.5], [2.2, 2.5]].map(([x, z]) => (
        <mesh key={`rail-${x}-${z}`} position={[x, 0.34, z]} castShadow>
          <boxGeometry args={[2.8, 0.08, 0.08]} />
          <meshStandardMaterial color={COLORS.wood} {...FLAT_MAT} />
        </mesh>
      ))}

      {TREES.map(([x, z, scale]) => (
        <group key={`${x}-${z}`} position={[x, 0, z]} scale={scale}>
          <mesh castShadow position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 0.7, 5]} />
            <meshStandardMaterial color={COLORS.wood} {...FLAT_MAT} />
          </mesh>
          <mesh castShadow position={[0, 0.9, 0]}>
            <coneGeometry args={[0.55, 1.1, 6]} />
            <meshStandardMaterial color={COLORS.grassDark} {...FLAT_MAT} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
