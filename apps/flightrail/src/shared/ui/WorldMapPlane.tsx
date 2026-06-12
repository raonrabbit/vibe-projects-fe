"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { drawWorldBorders, MAP_H, MAP_W } from "@/shared/lib/mapUtils";

const BORDER_TEX_W = 2048;
const BORDER_TEX_H = 1024;

export function WorldMapPlane({
  horizontal = false,
  scaleXZ = 1,
}: {
  horizontal?: boolean;
  scaleXZ?: number;
}) {
  const { gl } = useThree();
  const pendingApply = useRef(false);
  const borderTexRef = useRef<THREE.CanvasTexture | null>(null);
  const borderMeshRef = useRef<THREE.Mesh>(null);

  // Blue Marble: TextureLoader로 직접 로드 (캔버스 업스케일 없음)
  const baseMaterial = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/blue-marble.jpg", (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = gl.capabilities.getMaxAnisotropy();
      t.needsUpdate = true;
    });
    return new THREE.MeshBasicMaterial({
      map: tex,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
  }, [gl]);

  // 국경선: 투명 캔버스 텍스처
  const borderMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        toneMapped: false,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    let alive = true;
    const canvas = document.createElement("canvas");
    canvas.width = BORDER_TEX_W;
    canvas.height = BORDER_TEX_H;

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = gl.capabilities.getMaxAnisotropy();
    borderTexRef.current = tex;

    drawWorldBorders(canvas)
      .then(() => {
        if (!alive) return;
        tex.needsUpdate = true;
        pendingApply.current = true;
      })
      .catch(() => {});

    return () => {
      alive = false;
      tex.dispose();
      borderTexRef.current = null;
      borderMaterial.map = null;
    };
  }, [gl, borderMaterial]);

  useFrame(() => {
    if (
      !pendingApply.current ||
      !borderMeshRef.current ||
      !borderTexRef.current
    )
      return;
    borderMaterial.map = borderTexRef.current;
    borderMaterial.needsUpdate = true;
    pendingApply.current = false;
  });

  const rotation: [number, number, number] = horizontal
    ? [-Math.PI / 2, 0, 0]
    : [0, 0, 0];

  return (
    <group rotation={rotation} scale={[scaleXZ, scaleXZ, 1]}>
      {/* 위성 이미지 베이스 */}
      <mesh renderOrder={-1} material={baseMaterial}>
        <planeGeometry args={[MAP_W, MAP_H]} />
      </mesh>
      {/* 국경선 오버레이 */}
      <mesh
        ref={borderMeshRef}
        renderOrder={0}
        position={[0, 0, 0.01]}
        material={borderMaterial}
      >
        <planeGeometry args={[MAP_W, MAP_H]} />
      </mesh>
    </group>
  );
}
