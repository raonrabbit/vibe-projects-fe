"use client";

import {
    // Cloud,
    // Clouds,
    OrbitControls,
    PerspectiveCamera,
    Sky,
    Stars,
    useProgress,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
    type ComponentProps,
    memo,
    type RefObject,
    Suspense,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import * as THREE from "three";

import { getBlend, getSunPosition } from "@/shared/lib/sky-time";

import { AirplaneWindow, type CabinLightMode } from "./AirplaneWindow";

export type { CabinLightMode };
import { CloudLayer } from "./CloudLayer";
import { HorizonPlane } from "./HorizonPlane";
import {
    AMBIENT_INTENSITY,
    FOG_COLORS,
    HEMI_LIGHT,
    lerpColor,
    lerpN,
    NIGHT_FACTOR,
    SKY_GLOW,
    SKY_PARAMS,
} from "./sky-constants";

// ─── drei Clouds (disabled — using CloudLayer sprite stack) ───────
// type LayerKey = "near" | "mid" | "far" | "sky";
// const LAYERS: Record<LayerKey, { z: number; speed: number; opacity: number; bounds: [number, number, number] }> = { ... };
// const CLOUD_POOL = [ ... ];
// function MovingCloud(...) { ... }

function LayeredSky(props: ComponentProps<typeof Sky>) {
    const root = useRef<THREE.Group>(null!);
    useLayoutEffect(() => {
        root.current.traverse((obj) => {
            obj.renderOrder = -2;
        });
    }, []);
    return (
        <group ref={root}>
            <Sky {...props} />
        </group>
    );
}

// ─── Scene ────────────────────────────────────────────────────────
function Scene({
    hour,
    cabinMode,
    orbitRef,
}: {
    hour: number;
    cabinMode: CabinLightMode;
    orbitRef: RefObject<{ enabled: boolean } | null>;
}) {
    const dirLightRef = useRef<THREE.DirectionalLight>(null!);
    const sunPosition = getSunPosition(hour);
    const { from, to, t } = getBlend(hour);

    const fogColor = lerpColor(FOG_COLORS[from], FOG_COLORS[to], t);
    const skyParams = {
        turbidity: lerpN(
            SKY_PARAMS[from].turbidity,
            SKY_PARAMS[to].turbidity,
            t,
        ),
        rayleigh: lerpN(SKY_PARAMS[from].rayleigh, SKY_PARAMS[to].rayleigh, t),
        mieCoefficient: lerpN(
            SKY_PARAMS[from].mieCoefficient,
            SKY_PARAMS[to].mieCoefficient,
            t,
        ),
        mieDirectionalG: lerpN(
            SKY_PARAMS[from].mieDirectionalG,
            SKY_PARAMS[to].mieDirectionalG,
            t,
        ),
    };
    const hemi = {
        sky: lerpColor(HEMI_LIGHT[from].sky, HEMI_LIGHT[to].sky, t),
        ground: lerpColor(HEMI_LIGHT[from].ground, HEMI_LIGHT[to].ground, t),
        intensity: lerpN(
            HEMI_LIGHT[from].intensity,
            HEMI_LIGHT[to].intensity,
            t,
        ),
    };
    const ambientIntensity = lerpN(
        AMBIENT_INTENSITY[from],
        AMBIENT_INTENSITY[to],
        t,
    );
    const nightFactor = lerpN(NIGHT_FACTOR[from], NIGHT_FACTOR[to], t);
    const skyGlowColor = lerpColor(SKY_GLOW[from], SKY_GLOW[to], t);

    return (
        <>
            <fog attach="fog" args={[fogColor, 100, 220]} />
            <LayeredSky
                sunPosition={sunPosition}
                {...skyParams}
                distance={450}
            />
            <Suspense>
                <HorizonPlane />
                <CloudLayer nightFactor={nightFactor} />
            </Suspense>
            <ambientLight intensity={ambientIntensity} />
            <hemisphereLight args={[hemi.sky, hemi.ground, hemi.intensity]} />
            <directionalLight
                ref={dirLightRef}
                position={sunPosition}
                color="#fff8ee"
            />
            {nightFactor > 0.1 && (
                <group position={[0, 180, 0]}>
                    <Stars
                        radius={100}
                        depth={30}
                        count={3000}
                        factor={4}
                        fade
                    />
                </group>
            )}
            {/* <Suspense>
                <Clouds material={THREE.MeshBasicMaterial}>
                    {CLOUD_POOL.map((def) => (
                        <MovingCloud
                            key={def.id}
                            def={def}
                            nightFactor={nightFactor}
                        />
                    ))}
                </Clouds>
            </Suspense> */}
            <Suspense>
                <AirplaneWindow
                    sunPosition={sunPosition}
                    nightFactor={nightFactor}
                    skyGlowColor={skyGlowColor}
                    cabinMode={cabinMode}
                    orbitRef={orbitRef}
                    dirLightRef={dirLightRef}
                />
            </Suspense>
        </>
    );
}

function ReadySignal({ onReady }: { onReady?: () => void }) {
    const { active, total, loaded } = useProgress();
    const called = useRef(false);
    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    useEffect(() => {
        if (!active && total > 0 && loaded >= total && !called.current) {
            called.current = true;
            onReadyRef.current?.();
        }
    }, [active, total, loaded]);

    // Fallback: if all assets are cached (total stays 0), fire after mount
    useEffect(() => {
        const id = setTimeout(() => {
            if (!called.current) {
                called.current = true;
                onReadyRef.current?.();
            }
        }, 600);
        return () => clearTimeout(id);
    }, []);

    return null;
}

type OrbitControlsRef = React.ElementRef<typeof OrbitControls>;

const DEFAULT_CAM_POS = new THREE.Vector3(0, 0, 10);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

function WindowScene({
    hour,
    cabinMode,
    onReady,
}: {
    hour: number;
    cabinMode: CabinLightMode;
    onReady?: () => void;
}) {
    const orbitRef = useRef<OrbitControlsRef>(null);
    const [freeOrbit, setFreeOrbit] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "o" && e.key !== "O") return;
            if (e.target instanceof HTMLInputElement) return;
            if (e.target instanceof HTMLTextAreaElement) return;
            setFreeOrbit((v) => !v);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            orbitRef.current?.saveState();
        });
        return () => cancelAnimationFrame(id);
    }, []);

    const resetView = useCallback(() => {
        const controls = orbitRef.current;
        if (!controls) return;
        setFreeOrbit(false);
        controls.object.position.copy(DEFAULT_CAM_POS);
        controls.target.copy(DEFAULT_TARGET);
        controls.update();
        controls.saveState();
    }, []);

    return (
        <div className="relative h-full w-full">
            <Canvas
                className="h-full w-full"
                style={{ touchAction: "none" }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, powerPreference: "high-performance" }}
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ReinhardToneMapping;
                    gl.toneMappingExposure = 0.7;
                    gl.domElement.addEventListener(
                        "webglcontextlost",
                        (e) => e.preventDefault(),
                        false,
                    );
                }}
            >
                <ReadySignal onReady={onReady} />
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={20} />
                <OrbitControls
                    ref={orbitRef}
                    enablePan={freeOrbit}
                    enableZoom
                    zoomSpeed={0.45}
                    minDistance={freeOrbit ? 5 : 6}
                    maxDistance={freeOrbit ? 22 : 10}
                    rotateSpeed={freeOrbit ? 0.6 : 0.3}
                    minPolarAngle={freeOrbit ? 0.05 : Math.PI / 2 - 0.02}
                    maxPolarAngle={
                        freeOrbit ? Math.PI - 0.05 : Math.PI / 2 + 0.02
                    }
                    minAzimuthAngle={freeOrbit ? -Infinity : -0.02}
                    maxAzimuthAngle={freeOrbit ? Infinity : 0.02}
                />
                <Scene hour={hour} cabinMode={cabinMode} orbitRef={orbitRef} />
            </Canvas>
            <button
                type="button"
                onClick={resetView}
                className="absolute bottom-8 left-8 z-10 flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3.5 text-[12px] font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-white/10"
                aria-label="화면 기본 보기"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                >
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                </svg>
                기본 보기
            </button>
        </div>
    );
}

export default memo(WindowScene);
