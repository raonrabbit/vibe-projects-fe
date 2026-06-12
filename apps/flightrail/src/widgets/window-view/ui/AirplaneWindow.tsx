"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { lerpColor, lerpN } from "./sky-constants";

export type CabinLightMode = "auto" | "on" | "off";

// ─── Window opening dimensions ────────────────────────────────────
const WIN_RX = 0.5;
const WIN_RY = WIN_RX * 1.58; // 0.79

// Y-centers of the top/bottom arcs in the stadium shape
const STAD_TOP = WIN_RY - WIN_RX; // 0.29
const STAD_BOT = -(WIN_RY - WIN_RX); // -0.29

// Handle sits this far above the bottom edge of the blind
const HANDLE_OFFSET = 0.09;

// Handle stays inside the window at both extremes.
// At BLIND_OPEN:   handle near top    (WIN_RY - margin), bottom of blind partially in view
// At BLIND_CLOSED: handle near bottom (-(WIN_RY - margin)), top of blind partially in view
const BLIND_MARGIN = 0.15;
const BLIND_OPEN = WIN_RY - BLIND_MARGIN + 0.68; //  ≈  0.64
const BLIND_CLOSED = -(WIN_RY - BLIND_MARGIN) + 0.72; // ≈ -0.64
const BLIND_X = 0.02;

export function AirplaneWindow({
  sunPosition,
  nightFactor,
  skyGlowColor,
  cabinMode,
  orbitRef,
  dirLightRef,
}: {
  sunPosition: [number, number, number];
  nightFactor: number;
  skyGlowColor: string;
  cabinMode: CabinLightMode;
  orbitRef: RefObject<{ enabled: boolean } | null>;
  dirLightRef: RefObject<THREE.DirectionalLight>;
}) {
  const { camera, gl, size } = useThree();

  const blindOffsetRef = useRef(BLIND_OPEN);
  const draggingRef = useRef(false);

  const blindMeshRef = useRef<THREE.Mesh>(null!);
  const handleMeshRef = useRef<THREE.Mesh>(null!);
  const sunLightRef = useRef<THREE.PointLight>(null!);
  const skyGlowLightRef = useRef<THREE.PointLight>(null!);

  const nightFactorRef = useRef(nightFactor);
  useEffect(() => {
    nightFactorRef.current = nightFactor;
  }, [nightFactor]);

  const clientToWorldY = useCallback(
    (clientX: number, clientY: number) => {
      const ndcX = (clientX / size.width) * 2 - 1;
      const ndcY = 1 - (clientY / size.height) * 2;
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const t = (2 - camera.position.z) / dir.z;
      return camera.position.y + dir.y * t;
    },
    [camera, size],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const handleWorldY = clientToWorldY(e.clientX, e.clientY);
      const newOffset = handleWorldY + WIN_RY - HANDLE_OFFSET;
      blindOffsetRef.current = Math.max(
        BLIND_CLOSED,
        Math.min(BLIND_OPEN, newOffset),
      );
    };
    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      gl.domElement.style.cursor = "";
      if (orbitRef.current) orbitRef.current.enabled = true;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [clientToWorldY, gl, orbitRef]);

  useFrame(() => {
    const offset = blindOffsetRef.current;
    const nf = nightFactorRef.current;
    const blindOpenFactor =
      (offset - BLIND_CLOSED) / (BLIND_OPEN - BLIND_CLOSED);

    blindMeshRef.current.position.y = offset;
    handleMeshRef.current.position.y = offset - WIN_RY + HANDLE_OFFSET;
    sunLightRef.current.intensity =
      lerpN(35, 6, nf) * lerpN(0.7, 1, blindOpenFactor);
    skyGlowLightRef.current.intensity =
      lerpN(12, 3, nf) * lerpN(0.75, 1, blindOpenFactor);
    dirLightRef.current.intensity = lerpN(1.8, 0, nf) * blindOpenFactor;
  });

  const { scene } = useGLTF("/planewindow.glb");
  const windowModel = useMemo(() => scene.clone(), [scene]);

  const modelCenterOffset = useMemo(() => {
    const box = new THREE.Box3().setFromObject(windowModel);
    const center = new THREE.Vector3();
    box.getCenter(center);
    return new THREE.Vector3(center.x, center.y, 0);
  }, [windowModel]);

  const frameMaterial = useMemo(() => {
    let found: THREE.Material | null = null;
    windowModel.traverse((child) => {
      if (!found && child instanceof THREE.Mesh) {
        found = Array.isArray(child.material)
          ? child.material[0]
          : child.material;
      }
    });
    return (
      found ??
      new THREE.MeshStandardMaterial({
        color: "#c4bcb3",
        roughness: 0.75,
      })
    );
  }, [windowModel]);

  const handleMaterial = useMemo(() => {
    const mat = frameMaterial.clone() as THREE.MeshStandardMaterial;
    mat.color.set("#5a5550");
    return mat;
  }, [frameMaterial]);

  // Stadium (pill) shape — rounded top AND bottom matching the window opening.
  // Top arc: aClockwise=true → π → π/2 → 0 (upward pass = top half of circle).
  // Bottom arc: aClockwise=true → 0 → -π/2 → π (downward pass = bottom half).
  const blindGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-WIN_RX, STAD_TOP);
    s.absarc(0, STAD_TOP, WIN_RX, Math.PI, 0, true); // rounded top
    s.lineTo(WIN_RX, STAD_BOT);
    s.absarc(0, STAD_BOT, WIN_RX, 0, Math.PI, true); // rounded bottom
    s.closePath();
    return new THREE.ShapeGeometry(s, 48);
  }, []);

  // Horizontal pill handle — same visual language as the blind's rounded ends
  const handleGeo = useMemo(() => {
    const hw = WIN_RX * 0.38;
    const r = 0.02;
    const s = new THREE.Shape();
    s.moveTo(-hw + r, -r);
    s.lineTo(hw - r, -r);
    s.absarc(hw - r, 0, r, -Math.PI / 2, Math.PI / 2, false);
    s.lineTo(-hw + r, r);
    s.absarc(-hw + r, 0, r, Math.PI / 2, -Math.PI / 2, false);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, {
      depth: 0.03,
      bevelEnabled: false,
      curveSegments: 16,
    });
  }, []);

  const lx = sunPosition[0] * 4;
  const ly = Math.max(sunPosition[1] * 4, -1) + 2;
  // ramp from ~20:00 (nightFactor≈0.35) → fully on at 21:00 (nightFactor=0.55)
  const autoCabinFactor = Math.max(0, Math.min(1, (nightFactor - 0.35) / 0.2));
  const cabinFactor =
    cabinMode === "on" ? 1 : cabinMode === "off" ? 0 : autoCabinFactor;

  const blindInitPos = useMemo<[number, number, number]>(
    () => [BLIND_X, BLIND_OPEN, -0.05],
    [],
  );
  const handleInitPos = useMemo<[number, number, number]>(
    () => [BLIND_X, BLIND_OPEN - WIN_RY + HANDLE_OFFSET, 0.02],
    [],
  );

  useEffect(() => {
    return () => {
      blindGeo.dispose();
      handleGeo.dispose();
      handleMaterial.dispose();
      windowModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          mats.forEach((m) => m?.dispose());
        }
      });
    };
  }, [blindGeo, handleGeo, windowModel]);

  return (
    <group position={[0, 0, 2]}>
      <pointLight
        ref={sunLightRef}
        position={[lx, ly, -14]}
        color={lerpColor("#fff8ee", "#b8ccff", nightFactor)}
        distance={45}
        decay={1.5}
      />
      <pointLight
        ref={skyGlowLightRef}
        position={[0, 1.5, 4]}
        color={skyGlowColor}
        distance={12}
        decay={1.5}
      />
      <pointLight
        position={[0, WIN_RY + 0.1, 0.4]}
        intensity={cabinFactor * lerpN(5, 12, nightFactor)}
        color="#ffd060"
        distance={3.5}
        decay={2}
      />

      <primitive
        object={windowModel}
        position={[
          -modelCenterOffset.x,
          -modelCenterOffset.y,
          -modelCenterOffset.z,
        ]}
      />

      <mesh
        ref={blindMeshRef}
        geometry={blindGeo}
        position={blindInitPos}
        material={frameMaterial}
      />

      <mesh
        ref={handleMeshRef}
        geometry={handleGeo}
        position={handleInitPos}
        onPointerDown={(e) => {
          e.stopPropagation();
          (e.target as Element).setPointerCapture(e.pointerId);
          draggingRef.current = true;
          gl.domElement.style.cursor = "grabbing";
          if (orbitRef.current) orbitRef.current.enabled = false;
        }}
        onPointerEnter={() => {
          if (!draggingRef.current) gl.domElement.style.cursor = "grab";
        }}
        onPointerLeave={() => {
          if (!draggingRef.current) gl.domElement.style.cursor = "";
        }}
        material={handleMaterial}
      />
    </group>
  );
}

useGLTF.preload("/planewindow.glb");
