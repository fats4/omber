import type { ReactNode } from 'react';
import type { FlatCoord } from './flatCoords';

interface FlatAnchorProps {
  coord: FlatCoord;
  y?: number;
  facing?: number;
  children: ReactNode;
}

export function FlatAnchor({ coord, y = 0, facing = 0, children }: FlatAnchorProps) {
  return (
    <group position={[coord.x, y, coord.z]} rotation={[0, facing, 0]}>
      {children}
    </group>
  );
}
