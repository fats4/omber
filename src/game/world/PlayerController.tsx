import { useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlayerPosition } from '../useFarmGame';
import { keys } from '../input';
import { CAM_MOVE_FORWARD, CAM_MOVE_RIGHT, PLAYER_MOVE_SPEED } from './constants';
import { stepFlatMove } from './flatCoords';

interface PlayerControllerProps {
  playerRef: RefObject<PlayerPosition>;
  facingRef: RefObject<number>;
  moveSpeedRef: RefObject<number>;
  active: boolean;
}

export function PlayerController({
  playerRef,
  facingRef,
  moveSpeedRef,
  active,
}: PlayerControllerProps) {
  const moveDir = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!active) {
      moveSpeedRef.current = 0;
      return;
    }

    const p = playerRef.current;
    if (!p) return;

    const w = keys.has('w') || keys.has('arrowup');
    const s = keys.has('s') || keys.has('arrowdown');
    const a = keys.has('a') || keys.has('arrowleft');
    const d = keys.has('d') || keys.has('arrowright');

    moveDir.current.set(0, 0, 0);
    if (w) {
      moveDir.current.x += CAM_MOVE_FORWARD.x;
      moveDir.current.z += CAM_MOVE_FORWARD.z;
    }
    if (s) {
      moveDir.current.x -= CAM_MOVE_FORWARD.x;
      moveDir.current.z -= CAM_MOVE_FORWARD.z;
    }
    if (a) {
      moveDir.current.x -= CAM_MOVE_RIGHT.x;
      moveDir.current.z -= CAM_MOVE_RIGHT.z;
    }
    if (d) {
      moveDir.current.x += CAM_MOVE_RIGHT.x;
      moveDir.current.z += CAM_MOVE_RIGHT.z;
    }

    if (moveDir.current.lengthSq() < 1e-8) {
      moveSpeedRef.current = 0;
      return;
    }

    facingRef.current = Math.atan2(moveDir.current.x, moveDir.current.z);

    const result = stepFlatMove(
      p,
      facingRef.current,
      moveDir.current,
      delta,
      PLAYER_MOVE_SPEED,
    );

    playerRef.current = result.coord;
    moveSpeedRef.current = result.moveSpeed;
  });

  return null;
}
