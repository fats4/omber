import { Suspense, useLayoutEffect, type RefObject } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { FarmTile } from '../../data/farmData';
import { storyQuests } from '../../data/stories';
import type { StoryQuest } from '../../data/stories';
import type { PlayerPosition } from '../useFarmGame';
import { Farmhouse, VillagerHouse } from './Buildings';
import { CameraRig } from './CameraRig';
import { COLORS } from './constants';
import { FarmField } from './FarmField';
import { FarmWorld } from './FarmWorld';
import { PlayerAvatar } from './PlayerAvatar';
import { PlayerController } from './PlayerController';

interface StoryWorld3DProps {
  playerRef: RefObject<PlayerPosition>;
  facingRef: RefObject<number>;
  moveSpeedRef: RefObject<number>;
  isPlaying: boolean;
  harvestItem: string | null;
  currentQuest: StoryQuest | null;
  completedQuests: string[];
  canGetSeeds: boolean;
  tiles: FarmTile[];
}

function RendererSetup() {
  const { gl, scene } = useThree();

  useLayoutEffect(() => {
    gl.setClearColor(COLORS.sky);
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.BasicShadowMap;
    scene.background = new THREE.Color(COLORS.sky);
    scene.fog = new THREE.Fog(COLORS.fog, 28, 55);
  }, [gl, scene]);

  return null;
}

function Scene({
  playerRef,
  facingRef,
  moveSpeedRef,
  isPlaying,
  harvestItem,
  currentQuest,
  completedQuests,
  canGetSeeds,
  tiles,
}: StoryWorld3DProps) {
  return (
    <>
      <RendererSetup />

      <ambientLight intensity={0.82} color={COLORS.cream} />
      <directionalLight
        castShadow
        position={[8, 16, 6]}
        intensity={0.45}
        color={COLORS.warmLight}
        shadow-mapSize={[512, 512]}
        shadow-camera-far={40}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.001}
      />

      <FarmWorld />
      <FarmField tiles={tiles} currentQuest={currentQuest} />

      <Farmhouse canGetSeeds={canGetSeeds} />
      {storyQuests.map((quest) => (
        <VillagerHouse
          key={quest.id}
          quest={quest}
          done={completedQuests.includes(quest.id)}
          active={currentQuest?.id === quest.id && harvestItem === quest.id}
        />
      ))}

      <PlayerController
        playerRef={playerRef}
        facingRef={facingRef}
        moveSpeedRef={moveSpeedRef}
        active={isPlaying}
      />

      <PlayerAvatar
        playerRef={playerRef}
        facingRef={facingRef}
        moveSpeedRef={moveSpeedRef}
        carryingHarvest={Boolean(harvestItem)}
      />

      <CameraRig playerRef={playerRef} enabled />
    </>
  );
}

export function StoryWorld3D(props: StoryWorld3DProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.NoToneMapping,
      }}
      camera={{ fov: 38, near: 0.1, far: 120, position: [11, 13, 11] }}
      className="story-game__canvas"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  );
}
