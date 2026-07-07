import { useMemo, type ReactNode } from 'react';
import { SURFACE_ANCHOR_OFFSET } from './constants';
import { getSurfaceQuaternion, getWorldPosition, type SphericalCoord } from './sphereCoords';

interface SurfaceAnchorProps {
  coord: SphericalCoord;
  elevation?: number;
  facing?: number;
  children: ReactNode;
}

export function SurfaceAnchor({ coord, elevation = SURFACE_ANCHOR_OFFSET, facing = 0, children }: SurfaceAnchorProps) {
  const transform = useMemo(() => {
    const position = getWorldPosition(coord, elevation);
    const quaternion = getSurfaceQuaternion(coord.theta, coord.phi, facing).clone();
    return { position, quaternion };
  }, [coord.theta, coord.phi, elevation, facing]);

  return (
    <group position={transform.position} quaternion={transform.quaternion}>
      {children}
    </group>
  );
}

interface SurfaceMarkerProps {
  coord: SphericalCoord;
  radius?: number;
  color: string;
}

export function SurfaceMarker({ coord, radius = 0.55, color }: SurfaceMarkerProps) {
  return (
    <SurfaceAnchor coord={coord}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 20]} />
        <meshStandardMaterial color={color} transparent opacity={0.55} />
      </mesh>
    </SurfaceAnchor>
  );
}
