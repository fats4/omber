import { Component, Suspense, useRef, type ReactNode, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlayerPosition } from '../useFarmGame';
import { GAME_MODELS, LOAD_GLB_MODELS, MODEL_SETTINGS, PLAYER_ANIMATIONS } from './gameAssets';
import { PLAYER_MOVE_SPEED } from './constants';
import { AnimatedGlbModel, preloadGlb } from './GlbModel';
import { PlayerAvatarMesh } from './PlayerAvatarMesh';

interface PlayerAvatarProps {
  playerRef: RefObject<PlayerPosition>;
  facingRef: RefObject<number>;
  moveSpeedRef: RefObject<number>;
  carryingHarvest: boolean;
}

interface PlayerAvatarGlbProps extends PlayerAvatarProps {
  url: string;
}

function PlayerAvatarGlb({
  playerRef,
  facingRef,
  moveSpeedRef,
  url,
}: PlayerAvatarGlbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Object3D>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const settings = MODEL_SETTINGS.player;

  useFrame(({ clock }) => {
    const group = groupRef.current;
    const p = playerRef.current;
    if (!group || !p) return;

    group.position.set(p.x, 0, p.z);
    group.rotation.y = facingRef.current ?? 0;

    const speed = moveSpeedRef.current ?? 0;
    const moving = speed > 0.05;
    const walkRate = THREE.MathUtils.clamp(speed / PLAYER_MOVE_SPEED, 0.4, 1.2) * 8;
    const t = clock.elapsedTime;

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

      <AnimatedGlbModel
        url={url}
        modelRef={modelRef}
        walkClip={PLAYER_ANIMATIONS.walk}
        moveSpeedRef={moveSpeedRef}
        maxMoveSpeed={PLAYER_MOVE_SPEED}
        targetHeight={settings.targetHeight}
        yOffset={settings.yOffset}
        rotationY={settings.rotationY}
      />
    </group>
  );
}

class GlbFallbackBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

if (LOAD_GLB_MODELS.player) {
  preloadGlb(GAME_MODELS.player);
}

export function PlayerAvatar(props: PlayerAvatarProps) {
  if (!LOAD_GLB_MODELS.player) {
    return <PlayerAvatarMesh {...props} />;
  }

  return (
    <GlbFallbackBoundary fallback={<PlayerAvatarMesh {...props} />}>
      <Suspense fallback={<PlayerAvatarMesh {...props} />}>
        <PlayerAvatarGlb {...props} url={GAME_MODELS.player} />
      </Suspense>
    </GlbFallbackBoundary>
  );
}
