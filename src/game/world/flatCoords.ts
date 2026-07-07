import * as THREE from 'three';

export interface FlatCoord {
  x: number;
  z: number;
}

const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _move = new THREE.Vector3();

export function flatDistance(a: FlatCoord, b: FlatCoord): number {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.hypot(dx, dz);
}

export function facingToward(from: FlatCoord, to: FlatCoord): number {
  return Math.atan2(to.x - from.x, to.z - from.z);
}

export function getFlatBasis(facing: number) {
  _forward.set(Math.sin(facing), 0, Math.cos(facing));
  _right.set(Math.cos(facing), 0, -Math.sin(facing));
  return {
    forward: _forward.clone(),
    right: _right.clone(),
  };
}

export function stepFlatMove(
  coord: FlatCoord,
  facing: number,
  moveDir: THREE.Vector3,
  delta: number,
  moveSpeed: number,
): { coord: FlatCoord; facing: number; moveSpeed: number } {
  const clampedDelta = Math.min(delta, 0.05);

  if (moveDir.lengthSq() < 1e-8) {
    return { coord, facing, moveSpeed: 0 };
  }

  _move.copy(moveDir).normalize().multiplyScalar(moveSpeed * clampedDelta);

  return {
    coord: {
      x: coord.x + _move.x,
      z: coord.z + _move.z,
    },
    facing,
    moveSpeed: moveSpeed,
  };
}
