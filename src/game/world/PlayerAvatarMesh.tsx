import { useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlayerPosition } from '../useFarmGame';
import { COLORS, FLAT_MAT, PLAYER_MOVE_SPEED } from './constants';

interface PlayerAvatarMeshProps {
  playerRef: RefObject<PlayerPosition>;
  facingRef: RefObject<number>;
  moveSpeedRef: RefObject<number>;
  carryingHarvest: boolean;
}

export function PlayerAvatarMesh({
  playerRef,
  facingRef,
  moveSpeedRef,
  carryingHarvest,
}: PlayerAvatarMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const legLRef = useRef<THREE.Mesh>(null);
  const legRRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    const body = bodyRef.current;
    const p = playerRef.current;
    if (!group || !p) return;

    group.position.set(p.x, 0, p.z);
    group.rotation.y = facingRef.current ?? 0;

    const speed = moveSpeedRef.current ?? 0;
    const moving = speed > 0.05;
    const walkRate = THREE.MathUtils.clamp(speed / PLAYER_MOVE_SPEED, 0.4, 1.2) * 8;
    const t = clock.elapsedTime;

    if (body) {
      body.position.y = moving ? Math.abs(Math.sin(t * walkRate)) * 0.03 : 0;
    }

    if (legLRef.current && legRRef.current) {
      const swing = moving ? Math.sin(t * walkRate) * 0.35 : 0;
      legLRef.current.rotation.x = swing;
      legRRef.current.rotation.x = -swing;
    }

    if (shadowRef.current) {
      const scale = moving ? 1 + Math.sin(t * walkRate) * 0.06 : 1;
      shadowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.42, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} />
      </mesh>

      <group ref={bodyRef}>
        <group position={[-0.1, 0.22, 0]}>
          <mesh ref={legLRef} castShadow position={[0, -0.1, 0]}>
            <boxGeometry args={[0.12, 0.2, 0.12]} />
            <meshStandardMaterial color={COLORS.playerBody} {...FLAT_MAT} />
          </mesh>
        </group>
        <group position={[0.1, 0.22, 0]}>
          <mesh ref={legRRef} castShadow position={[0, -0.1, 0]}>
            <boxGeometry args={[0.12, 0.2, 0.12]} />
            <meshStandardMaterial color={COLORS.playerBody} {...FLAT_MAT} />
          </mesh>
        </group>

        <mesh castShadow position={[0, 0.48, 0]}>
          <boxGeometry args={[0.38, 0.32, 0.24]} />
          <meshStandardMaterial color={COLORS.cream} {...FLAT_MAT} />
        </mesh>

        <mesh castShadow position={[0, 0.78, 0]}>
          <sphereGeometry args={[0.34, 10, 10]} />
          <meshStandardMaterial color={COLORS.playerHead} {...FLAT_MAT} />
        </mesh>

        <mesh castShadow position={[0, 0.95, -0.02]}>
          <boxGeometry args={[0.36, 0.12, 0.32]} />
          <meshStandardMaterial color={COLORS.playerHair} {...FLAT_MAT} />
        </mesh>

        <mesh castShadow position={[-0.18, 0.48, 0]}>
          <boxGeometry args={[0.1, 0.28, 0.1]} />
          <meshStandardMaterial color={COLORS.playerHead} {...FLAT_MAT} />
        </mesh>
        <mesh castShadow position={[0.18, 0.48, 0]}>
          <boxGeometry args={[0.1, 0.28, 0.1]} />
          <meshStandardMaterial color={COLORS.playerHead} {...FLAT_MAT} />
        </mesh>

        {carryingHarvest && (
          <mesh castShadow position={[0.28, 0.55, 0.15]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color={COLORS.greenDark} {...FLAT_MAT} />
          </mesh>
        )}
      </group>
    </group>
  );
}
