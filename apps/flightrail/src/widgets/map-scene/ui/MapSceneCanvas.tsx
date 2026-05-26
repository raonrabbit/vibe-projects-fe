"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

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

export default function MapSceneCanvas() {
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
            <ambientLight intensity={0.7} />
            <directionalLight position={[4, 8, 6]} intensity={0.5} />

            <WorldMapPlane scaleXZ={HOME_MAP_SCALE} />

            {DEMO_ROUTES.map((route, i) => (
                <FlightRoute key={i} {...route} mapScale={HOME_MAP_SCALE} />
            ))}

            <OrbitControls
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
