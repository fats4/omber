import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, FLAT_MAT } from './constants';
import { SurfaceAnchor } from './SurfaceAnchor';
import { arcMidpoint, type SphericalCoord } from './sphereCoords';

function Rock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh castShadow receiveShadow position={position} rotation={[0, Math.random() * Math.PI, 0]}>
      <dodecahedronGeometry args={[0.35 * scale, 0]} />
      <meshStandardMaterial color={COLORS.rock} {...FLAT_MAT} />
    </mesh>
  );
}

function Bush({ position, color = COLORS.grassDark }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color={color} {...FLAT_MAT} />
      </mesh>
      <mesh castShadow position={[0.28, 0.16, 0.12]}>
        <sphereGeometry args={[0.24, 8, 8]} />
        <meshStandardMaterial color={COLORS.grassDark} {...FLAT_MAT} />
      </mesh>
    </group>
  );
}

function Mailbox({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[0.35, 1.1, 0.35]} />
        <meshStandardMaterial color={COLORS.purple} {...FLAT_MAT} />
      </mesh>
      <mesh castShadow position={[0, 1.05, 0]}>
        <boxGeometry args={[0.55, 0.35, 0.45]} />
        <meshStandardMaterial color={COLORS.cream} {...FLAT_MAT} />
      </mesh>
      <mesh position={[0, 1.05, 0.24]}>
        <boxGeometry args={[0.25, 0.12, 0.04]} />
        <meshStandardMaterial color={COLORS.green} emissive={COLORS.green} emissiveIntensity={0.25} {...FLAT_MAT} />
      </mesh>
    </group>
  );
}

function CrateStack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[0.55, 0.44, 0.55]} />
        <meshStandardMaterial color={COLORS.wood} {...FLAT_MAT} />
      </mesh>
      <mesh castShadow position={[0.15, 0.55, -0.1]}>
        <boxGeometry args={[0.4, 0.35, 0.4]} />
        <meshStandardMaterial color={COLORS.package} {...FLAT_MAT} />
      </mesh>
    </group>
  );
}

function SignPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 1.2, 6]} />
        <meshStandardMaterial color={COLORS.wood} {...FLAT_MAT} />
      </mesh>
      <mesh castShadow position={[0, 1.15, 0]}>
        <boxGeometry args={[0.9, 0.35, 0.08]} />
        <meshStandardMaterial color={COLORS.cream} {...FLAT_MAT} />
      </mesh>
    </group>
  );
}

export function WorldProps() {
  return (
    <group>
      <Mailbox position={[-11, 0, -9]} />
      <CrateStack position={[-15.5, 0, -10.5]} />
      <CrateStack position={[-14.8, 0, -9.2]} />

      <Rock position={[5, 0.15, -6]} scale={1.1} />
      <Rock position={[7.5, 0.12, -4]} scale={0.8} />
      <Rock position={[-6, 0.1, 12]} />
      <Rock position={[14, 0.14, 8]} scale={0.9} />
      <Rock position={[-14, 0.12, 3]} scale={0.7} />

      <Bush position={[3, 0, -11]} />
      <Bush position={[-2, 0, 14]} color={COLORS.grassLight} />
      <Bush position={[15, 0, -2]} />
      <Bush position={[-12, 0, 5]} />

      <SignPost position={[-8, 0, -5]} />
    </group>
  );
}

interface InteractPulseProps {
  position: [number, number, number];
  active: boolean;
  color?: string;
}

export function InteractPulse({ position, active, color = COLORS.green }: InteractPulseProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const dotRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!active) return;
    const t = clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
      ringRef.current.rotation.x = -Math.PI / 2;
    }
    if (dotRef.current) {
      dotRef.current.position.y = 0.15 + Math.sin(t * 4) * 0.12;
    }
  });

  if (!active) return null;

  return (
    <group position={position}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
        <ringGeometry args={[0.7, 0.95, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          {...FLAT_MAT}
        />
      </mesh>
      <mesh ref={dotRef} position={[0, 0.2, 0]}>
        <octahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} {...FLAT_MAT} />
      </mesh>
    </group>
  );
}

export function QuestBeacon({
  from,
  to,
  visible,
}: {
  from: SphericalCoord;
  to: SphericalCoord;
  visible: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !visible) return;
    meshRef.current.position.y = 0.8 + Math.sin(clock.elapsedTime * 2.5) * 0.12;
  });

  if (!visible) return null;

  const mid = arcMidpoint(from, to);

  return (
    <SurfaceAnchor coord={mid} elevation={1.8}>
      <mesh ref={meshRef}>
        <coneGeometry args={[0.16, 0.4, 4]} />
        <meshStandardMaterial color={COLORS.green} emissive={COLORS.green} emissiveIntensity={0.55} {...FLAT_MAT} />
      </mesh>
    </SurfaceAnchor>
  );
}
