import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { StoryQuest } from '../../data/stories';
import { FARMHOUSE_POSITION, PLAYER_START } from '../../data/stories';
import { COLORS, FLAT_MAT, NPC_ACCENTS } from './constants';
import { facingToward } from './flatCoords';
import { FlatAnchor } from './FlatAnchor';
import { InteractPulse } from './Props';

interface FarmhouseProps {
  canGetSeeds: boolean;
}

export function Farmhouse({ canGetSeeds }: FarmhouseProps) {
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    glowRef.current.intensity = canGetSeeds ? 0.35 + Math.sin(clock.elapsedTime * 3) * 0.1 : 0.1;
  });

  return (
    <FlatAnchor
      coord={FARMHOUSE_POSITION}
      facing={facingToward(FARMHOUSE_POSITION, PLAYER_START)}
    >
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[2.4, 16]} />
        <meshStandardMaterial color={COLORS.path} {...FLAT_MAT} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[3, 0.36, 2.4]} />
        <meshStandardMaterial color={COLORS.wood} {...FLAT_MAT} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.95, 0]}>
        <boxGeometry args={[2.8, 1.5, 2.2]} />
        <meshStandardMaterial color="#c45c26" {...FLAT_MAT} />
      </mesh>

      <mesh castShadow position={[0, 2.05, 0]}>
        <boxGeometry args={[2.4, 1.2, 1.8]} />
        <meshStandardMaterial color={COLORS.cream} {...FLAT_MAT} />
      </mesh>

      <mesh castShadow position={[0, 2.85, 0]}>
        <boxGeometry args={[2.8, 0.32, 2.4]} />
        <meshStandardMaterial color="#6d4c41" {...FLAT_MAT} />
      </mesh>

      <mesh position={[0, 1.05, 1.12]}>
        <boxGeometry args={[0.65, 0.85, 0.08]} />
        <meshStandardMaterial color="#87ceeb" {...FLAT_MAT} />
      </mesh>

      {canGetSeeds && (
        <mesh castShadow position={[-1, 0.45, 1.2]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color={COLORS.greenDark} {...FLAT_MAT} />
        </mesh>
      )}

      <pointLight ref={glowRef} position={[0, 2.5, 1.2]} color={COLORS.warmLight} distance={5} intensity={0.1} />

      <InteractPulse position={[0, 0.05, 1.5]} active={canGetSeeds} color={COLORS.green} />

      <Html position={[0, 3.2, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <span className="world-label world-label--hq">Rumah</span>
      </Html>
    </FlatAnchor>
  );
}

interface VillagerHouseProps {
  quest: StoryQuest;
  done: boolean;
  active: boolean;
}

export function VillagerHouse({ quest, done, active }: VillagerHouseProps) {
  const accent = done ? COLORS.npcDone : NPC_ACCENTS[quest.id] ?? COLORS.purple;
  const awning = done ? COLORS.npcDone : active ? COLORS.green : accent;

  return (
    <FlatAnchor coord={quest.position}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[1.2, 14]} />
        <meshStandardMaterial color={COLORS.path} {...FLAT_MAT} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.58, 0]}>
        <boxGeometry args={[1.6, 1.16, 1.6]} />
        <meshStandardMaterial color={done ? COLORS.npcDone : COLORS.npcDefault} {...FLAT_MAT} />
      </mesh>

      <mesh castShadow position={[0, 1.35, 0]}>
        <boxGeometry args={[1.9, 0.5, 1.9]} />
        <meshStandardMaterial color={awning} {...FLAT_MAT} />
      </mesh>

      <mesh castShadow position={[0, 0.95, 0.82]}>
        <boxGeometry args={[0.7, 0.6, 0.08]} />
        <meshStandardMaterial
          color={accent}
          emissive={active ? accent : '#000000'}
          emissiveIntensity={active ? 0.15 : 0}
          {...FLAT_MAT}
        />
      </mesh>

      <InteractPulse position={[0, 0.05, 1.05]} active={active} />

      <Html position={[0, 2.1, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <span className={`world-label ${active ? 'world-label--active' : ''} ${done ? 'world-label--done' : ''}`}>
          {quest.npcName}
        </span>
      </Html>
    </FlatAnchor>
  );
}

/** @deprecated */
export const HqBuilding = Farmhouse;
export const NpcBuilding = VillagerHouse;
