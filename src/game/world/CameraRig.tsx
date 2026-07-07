import { useLayoutEffect, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlayerPosition } from '../useFarmGame';

interface CameraRigProps {
  playerRef: RefObject<PlayerPosition>;
  enabled?: boolean;
}

/** Kamera isometrik tetap ala Harvest Moon BTN */
const ISO_OFFSET = new THREE.Vector3(11, 13, 11);
const targetPos = new THREE.Vector3();
const lookAt = new THREE.Vector3();
const smoothLookAt = new THREE.Vector3();

export function CameraRig({ playerRef, enabled = true }: CameraRigProps) {
  const initialized = useRef(false);
  const { camera } = useThree();

  function updateCamera() {
    const p = playerRef.current;
    if (!p) return;

    lookAt.set(p.x, 0.55, p.z);
    targetPos.set(p.x + ISO_OFFSET.x, ISO_OFFSET.y, p.z + ISO_OFFSET.z);
  }

  useLayoutEffect(() => {
    updateCamera();
    camera.position.copy(targetPos);
    smoothLookAt.copy(lookAt);
    camera.lookAt(smoothLookAt);
    camera.up.set(0, 1, 0);
    camera.updateProjectionMatrix();
    initialized.current = true;
  }, [camera, playerRef]);

  useFrame((_, delta) => {
    if (!enabled) return;

    updateCamera();

    const smooth = 1 - Math.exp(-12 * delta);

    if (!initialized.current) {
      camera.position.copy(targetPos);
      smoothLookAt.copy(lookAt);
      initialized.current = true;
    } else {
      camera.position.lerp(targetPos, smooth);
      smoothLookAt.lerp(lookAt, smooth);
    }

    camera.up.set(0, 1, 0);
    camera.lookAt(smoothLookAt);
  });

  return null;
}
