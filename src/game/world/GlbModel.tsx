import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clone as cloneSkinnedScene } from 'three/examples/jsm/utils/SkeletonUtils.js';

interface GlbModelProps {
  url: string;
  targetHeight?: number;
  yOffset?: number;
  rotationY?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export function prepareGlbScene(
  scene: THREE.Object3D,
  {
    targetHeight = 1,
    yOffset = 0,
    rotationY = 0,
    castShadow = true,
    receiveShadow = true,
    skinned = false,
  }: Omit<GlbModelProps, 'url'> & { skinned?: boolean },
) {
  const root = skinned ? cloneSkinnedScene(scene) : scene.clone(true);

  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
    }
  });

  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root, skinned);
  const size = box.getSize(new THREE.Vector3());

  if (size.y > 1e-4) {
    const scale = targetHeight / size.y;
    root.scale.multiplyScalar(scale);
    root.updateMatrixWorld(true);
    const fitted = new THREE.Box3().setFromObject(root, skinned);
    root.position.y = -fitted.min.y + yOffset;
  }

  root.rotation.y = rotationY;
  return root;
}

export function GlbModel({
  url,
  targetHeight = 1,
  yOffset = 0,
  rotationY = 0,
  castShadow = true,
  receiveShadow = true,
}: GlbModelProps) {
  const { scene } = useGLTF(url);

  const model = useMemo(
    () =>
      prepareGlbScene(scene, {
        targetHeight,
        yOffset,
        rotationY,
        castShadow,
        receiveShadow,
      }),
    [scene, targetHeight, yOffset, rotationY, castShadow, receiveShadow],
  );

  return <primitive object={model} />;
}

interface AnimatedGlbModelProps extends GlbModelProps {
  modelRef: RefObject<THREE.Object3D | null>;
  walkClip: string;
  moveSpeedRef: RefObject<number>;
  maxMoveSpeed: number;
}

export function AnimatedGlbModel({
  url,
  modelRef,
  walkClip,
  moveSpeedRef,
  maxMoveSpeed,
  targetHeight = 1,
  yOffset = 0,
  rotationY = 0,
  castShadow = true,
  receiveShadow = true,
}: AnimatedGlbModelProps) {
  const { scene, animations } = useGLTF(url);
  const movingRef = useRef(false);

  const model = useMemo(
    () =>
      prepareGlbScene(scene, {
        targetHeight,
        yOffset,
        rotationY,
        castShadow,
        receiveShadow,
        skinned: true,
      }),
    [scene, targetHeight, yOffset, rotationY, castShadow, receiveShadow],
  );

  const { actions } = useAnimations(animations, modelRef);

  useEffect(() => {
    const walk = actions[walkClip];
    if (!walk) return;
    walk.setLoop(THREE.LoopRepeat, Infinity);
  }, [actions, walkClip]);

  useFrame(() => {
    const walk = actions[walkClip];
    if (!walk) return;

    const speed = moveSpeedRef.current ?? 0;
    const moving = speed > 0.05;

    if (moving) {
      if (!movingRef.current) {
        walk.reset().fadeIn(0.15).play();
      }
      walk.timeScale = THREE.MathUtils.clamp(speed / maxMoveSpeed, 0.65, 1.35);
    } else if (movingRef.current) {
      walk.fadeOut(0.15);
      walk.stop();
    }

    movingRef.current = moving;
  });

  return <primitive ref={modelRef} object={model} />;
}

export function preloadGlb(url: string) {
  useGLTF.preload(url);
}
