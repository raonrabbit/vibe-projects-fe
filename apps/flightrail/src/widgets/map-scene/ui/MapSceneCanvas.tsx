"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

import { MAP_W, WORLD_MAP_SCALE } from "@/shared/lib/mapUtils";
import { WorldMapPlane } from "@/shared/ui/WorldMapPlane";

import { FlightRoute } from "./FlightRoute";

const HOME_MAP_SCALE = WORLD_MAP_SCALE;

// Demo routes shown on the homepage (ICN as hub)
const DEMO_ROUTES = [
  {
    fromLat: 37.46,
    fromLng: 126.44,
    toLat: 35.55,
    toLng: 139.78,
    color: "#3b82f6",
    speed: 0.9,
    initialProgress: 0.0,
  }, // ICN → NRT
  {
    fromLat: 37.46,
    fromLng: 126.44,
    toLat: 51.47,
    toLng: -0.46,
    color: "#60a5fa",
    speed: 0.5,
    initialProgress: 0.35,
  }, // ICN → LHR
  {
    fromLat: 37.46,
    fromLng: 126.44,
    toLat: 40.64,
    toLng: -73.78,
    color: "#93c5fd",
    speed: 0.45,
    initialProgress: 0.6,
  }, // ICN → JFK
  {
    fromLat: 37.46,
    fromLng: 126.44,
    toLat: -33.94,
    toLng: 151.18,
    color: "#7dd3fc",
    speed: 0.6,
    initialProgress: 0.2,
  }, // ICN → SYD
];

// Persists across page navigations (module is cached by Next.js)
let savedMapCamPos: [number, number, number] | null = null;

function CameraRestore({
  controlsRef,
}: {
  controlsRef: React.MutableRefObject<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  const { camera } = useThree();
  const restored = useRef(false);

  useFrame(() => {
    if (!restored.current && savedMapCamPos && controlsRef.current) {
      camera.position.set(...savedMapCamPos);
      controlsRef.current.update();
      restored.current = true;
    }
  });

  useEffect(() => {
    return () => {
      savedMapCamPos = [
        camera.position.x,
        camera.position.y,
        camera.position.z,
      ];
    };
  }, []);

  return null;
}

export default function MapSceneCanvas() {
  const controlsRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <Canvas
      camera={{
        position: [0, HOME_MAP_SCALE * 1.6, HOME_MAP_SCALE * 5.6],
        fov: 50,
        near: 0.02,
        far: Math.max(800, MAP_W * HOME_MAP_SCALE * 4),
      }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <CameraRestore controlsRef={controlsRef} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 8, 6]} intensity={0.5} />

      <WorldMapPlane scaleXZ={HOME_MAP_SCALE} />

      {DEMO_ROUTES.map((route, i) => (
        <FlightRoute key={i} {...route} mapScale={HOME_MAP_SCALE} />
      ))}

      <OrbitControls
        ref={controlsRef}
        autoRotate
        autoRotateSpeed={0.25}
        enableDamping
        dampingFactor={0.06}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.4}
      />
    </Canvas>
  );
}
