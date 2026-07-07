import * as THREE from 'three';
import { PLANET_RADIUS } from './constants';

export { PLANET_RADIUS };

export interface SphericalCoord {
  theta: number;
  phi: number;
}

const _next = new THREE.Vector3();
const Y_UP = new THREE.Vector3(0, 1, 0);
const _spin = new THREE.Quaternion();
const _surfaceQuat = new THREE.Quaternion();

export function sphericalToVector(
  theta: number,
  phi: number,
  radius = PLANET_RADIUS,
): THREE.Vector3 {
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    radius * sinPhi * Math.sin(theta),
    radius * Math.cos(phi),
    radius * sinPhi * Math.cos(theta),
  );
}

export function vectorToSpherical(vec: THREE.Vector3): SphericalCoord {
  const n = vec.clone().normalize();
  return {
    phi: Math.acos(THREE.MathUtils.clamp(n.y, -1, 1)),
    theta: Math.atan2(n.x, n.z),
  };
}

export function surfaceDistance(a: SphericalCoord, b: SphericalCoord, radius = PLANET_RADIUS): number {
  const va = sphericalToVector(a.theta, a.phi, 1);
  const vb = sphericalToVector(b.theta, b.phi, 1);
  const angle = Math.acos(THREE.MathUtils.clamp(va.dot(vb), -1, 1));
  return radius * angle;
}

export function getTangentBasis(theta: number, phi: number, facing: number) {
  const normal = sphericalToVector(theta, phi, 1);
  const reference = Math.abs(normal.y) > 0.92
    ? new THREE.Vector3(1, 0, 0)
    : new THREE.Vector3(0, 1, 0);

  const east = new THREE.Vector3().crossVectors(reference, normal).normalize();
  const north = new THREE.Vector3().crossVectors(normal, east).normalize();
  const forward = north
    .clone()
    .multiplyScalar(Math.cos(facing))
    .add(east.clone().multiplyScalar(Math.sin(facing)));
  const right = new THREE.Vector3().crossVectors(forward, normal).normalize();

  return { normal, forward, right, east, north };
}

/**
 * Orientasi tegak di permukaan (Y = normal). Mutates internal scratch — `.clone()` if storing.
 * `facing` = yaw lokal sekitar sumbu Y setelah menempel di permukaan.
 */
export function getSurfaceQuaternion(theta: number, phi: number, facing = 0): THREE.Quaternion {
  const normal = sphericalToVector(theta, phi, 1);
  _surfaceQuat.setFromUnitVectors(Y_UP, normal);
  if (facing !== 0) {
    _spin.setFromAxisAngle(Y_UP, facing);
    _surfaceQuat.multiply(_spin);
  }
  return _surfaceQuat;
}

/** Gerak relatif arah hadap karakter — facing tidak berubah saat jalan/strafe */
export function stepOnSphereMove(
  coord: SphericalCoord,
  facing: number,
  moveDir: THREE.Vector3,
  delta: number,
  moveSpeed: number,
): { coord: SphericalCoord; facing: number; moveSpeed: number } {
  const clampedDelta = Math.min(delta, 0.05);

  if (moveDir.lengthSq() < 1e-8) {
    return { coord, facing, moveSpeed: 0 };
  }

  const dir = moveDir.clone().normalize();
  const angularStep = (moveSpeed * clampedDelta) / PLANET_RADIUS;

  _next.copy(sphericalToVector(coord.theta, coord.phi, 1));
  _next.add(dir.multiplyScalar(angularStep)).normalize();

  return {
    coord: vectorToSpherical(_next),
    facing,
    moveSpeed: moveSpeed,
  };
}

export function getWorldPosition(coord: SphericalCoord, elevation = 0): THREE.Vector3 {
  return sphericalToVector(coord.theta, coord.phi, PLANET_RADIUS + elevation);
}

/** Sudut hadap (radian) dari `from` menuju `to` di bidang tangen permukaan */
export function facingToward(from: SphericalCoord, to: SphericalCoord): number {
  const normal = sphericalToVector(from.theta, from.phi, 1);
  const tangent = sphericalToVector(to.theta, to.phi, 1)
    .sub(sphericalToVector(from.theta, from.phi, 1));
  tangent.addScaledVector(normal, -tangent.dot(normal));

  if (tangent.lengthSq() < 1e-8) return 0;

  tangent.normalize();
  const { east, north } = getTangentBasis(from.theta, from.phi, 0);
  return Math.atan2(tangent.dot(east), tangent.dot(north));
}

export function arcMidpoint(a: SphericalCoord, b: SphericalCoord): SphericalCoord {
  const va = sphericalToVector(a.theta, a.phi, 1);
  const vb = sphericalToVector(b.theta, b.phi, 1);
  return vectorToSpherical(va.add(vb));
}

/** Geser koordinat sepanjang bidang tangen (x = east, z = north) dalam meter */
export function offsetOnSphere(
  base: SphericalCoord,
  offsetX: number,
  offsetZ: number,
): SphericalCoord {
  const { east, north } = getTangentBasis(base.theta, base.phi, 0);
  _next
    .copy(east)
    .multiplyScalar(offsetX)
    .add(north.clone().multiplyScalar(offsetZ));

  const step = _next.length() / PLANET_RADIUS;
  if (step < 1e-8) return base;

  return vectorToSpherical(
    sphericalToVector(base.theta, base.phi, 1).add(_next.normalize().multiplyScalar(step)),
  );
}
