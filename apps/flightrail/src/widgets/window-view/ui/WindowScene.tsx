"use client";

import {
    Cloud,
    Clouds,
    GradientTexture,
    PerspectiveCamera,
    Stars,
    useGLTF,
    useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    memo,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import * as THREE from "three";

import { getSunPosition, getTimeOfDay } from "@/shared/lib/sky-time";

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
const BLIND_CLOSED = -(WIN_RY - BLIND_MARGIN) + 0.75; // ≈ -0.64
const BLIND_X = 0.02;

// ─── Airplane window + blind ───────────────────────────────────────
function AirplaneWindow({
    sunPosition,
    isNight,
}: {
    sunPosition: [number, number, number];
    isNight: boolean;
}) {
    const { camera, gl, size } = useThree();

    // blindOffset drives the vertical position of the blind mesh.
    // Starts open so the sky is visible immediately.
    const [blindOffset, setBlindOffset] = useState(BLIND_OPEN);
    const draggingRef = useRef(false);

    // Project pointer client coords → world Y at the window group plane (z = 2)
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
            // handle Y = (blindOffset - WIN_RY) + HANDLE_OFFSET → blindOffset = handleWorldY + WIN_RY - HANDLE_OFFSET
            const newOffset = handleWorldY + WIN_RY - HANDLE_OFFSET;
            setBlindOffset(
                Math.max(BLIND_CLOSED, Math.min(BLIND_OPEN, newOffset)),
            );
        };
        const onUp = () => {
            if (!draggingRef.current) return;
            draggingRef.current = false;
            gl.domElement.style.cursor = "";
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };
    }, [clientToWorldY, gl]);

    const { scene } = useGLTF("/planewindow.glb");
    // Clone so each mount gets a fresh object — prevents accumulated position drift on hot reload
    const windowModel = useMemo(() => scene.clone(), [scene]);

    const modelCenterOffset = useMemo(() => {
        const box = new THREE.Box3().setFromObject(windowModel);
        const center = new THREE.Vector3();
        box.getCenter(center);
        return new THREE.Vector3(center.x, center.y, 0);
    }, [windowModel]);

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

    // Dispose GPU resources on unmount to prevent VRAM leak across HMR cycles
    useEffect(() => {
        return () => {
            blindGeo.dispose();
            handleGeo.dispose();
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
                position={[lx, ly, -14]}
                intensity={isNight ? 6 : 35}
                color={isNight ? "#b8ccff" : "#fff8ee"}
                distance={45}
                decay={1.5}
            />
            <pointLight
                position={[0, 1.5, 4]}
                intensity={isNight ? 3 : 12}
                color={isNight ? "#3a3a50" : "#ffe8c8"}
                distance={12}
                decay={1.5}
            />

            <primitive
                object={windowModel}
                position={[
                    -modelCenterOffset.x,
                    -modelCenterOffset.y,
                    -modelCenterOffset.z,
                ]}
            />

            {/* Blind slides as a unit — frame GLB masks what goes above/below the opening */}
            <mesh geometry={blindGeo} position={[BLIND_X, blindOffset, -0.05]}>
                <meshStandardMaterial
                    color="#c4bcb3"
                    roughness={0.75}
                    metalness={0}
                />
            </mesh>

            {/* Handle tracks the bottom edge of the blind */}
            <mesh
                geometry={handleGeo}
                position={[BLIND_X, blindOffset - WIN_RY + HANDLE_OFFSET, 0.02]}
                onPointerDown={(e) => {
                    e.stopPropagation();
                    draggingRef.current = true;
                    gl.domElement.style.cursor = "grabbing";
                }}
                onPointerEnter={() => {
                    if (!draggingRef.current)
                        gl.domElement.style.cursor = "grab";
                }}
                onPointerLeave={() => {
                    if (!draggingRef.current) gl.domElement.style.cursor = "";
                }}
            >
                <meshStandardMaterial
                    color="#8c847c"
                    roughness={0.65}
                    metalness={0.05}
                />
            </mesh>
        </group>
    );
}

// ─── Clouds ───────────────────────────────────────────────────────
type LayerKey = "near" | "mid" | "far" | "sky";

const LAYERS: Record<
    LayerKey,
    {
        z: number;
        speed: number;
        opacity: number;
        bounds: [number, number, number];
    }
> = {
    near: { z: -18, speed: 0.9, opacity: 0.72, bounds: [7, 0.45, 1] },
    mid: { z: -32, speed: 0.4, opacity: 0.52, bounds: [10, 0.7, 2] },
    far: { z: -52, speed: 0.15, opacity: 0.32, bounds: [14, 1.0, 3] },
    sky: { z: -65, speed: 0.22, opacity: 0.22, bounds: [6, 0.5, 1.2] },
};

const CLOUD_POOL: Array<{
    id: number;
    x: number;
    y: number;
    scale: number;
    layer: LayerKey;
}> = [
    { id: 0, x: -20, y: 0.5, scale: 0.9, layer: "near" },
    { id: 1, x: 40, y: 0.3, scale: 0.8, layer: "near" },
    { id: 2, x: 10, y: -4.0, scale: 1.5, layer: "mid" },
    { id: 3, x: -30, y: -3.5, scale: 2.5, layer: "far" },
    { id: 4, x: 60, y: 1.5, scale: 0.7, layer: "sky" },
];

const BOUNDS = 70;

function MovingCloud({
    def,
    isNight,
}: {
    def: (typeof CLOUD_POOL)[number];
    isNight: boolean;
}) {
    const ref = useRef<THREE.Group>(null!);
    const layer = LAYERS[def.layer];

    useFrame((_, delta) => {
        ref.current.position.x -= layer.speed * delta;
        if (ref.current.position.x < -BOUNDS)
            ref.current.position.x += BOUNDS * 2;
    });

    return (
        <Cloud
            ref={ref}
            position={[def.x, def.y, layer.z]}
            opacity={layer.opacity * (isNight ? 0.3 : 1)}
            scale={def.scale}
            seed={def.id}
            speed={0}
            bounds={layer.bounds}
            fade={0.5}
            segments={4}
        />
    );
}

type SkyColors = [string, string, string];
const SKY_COLORS: Record<ReturnType<typeof getTimeOfDay>, SkyColors> = {
    night: ["#020810", "#060F1E", "#0D1F35"],
    dawn: ["#1A3A6B", "#6A6AAA", "#FF9A5C"],
    morning: ["#0B3A7A", "#3A82BC", "#D0EAFF"],
    day: ["#0A3A8F", "#2B72C8", "#B8DEFF"],
    evening: ["#1A1050", "#8A3060", "#FF8040"],
    dusk: ["#0D0828", "#3A1050", "#C05070"],
};

function GradientSky({
    timeOfDay,
}: {
    timeOfDay: ReturnType<typeof getTimeOfDay>;
}) {
    const colors = SKY_COLORS[timeOfDay];
    const stops = [0, 0.5, 1] as [number, number, number];
    return (
        <mesh scale={450} renderOrder={-1}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshBasicMaterial side={THREE.BackSide} depthWrite={false}>
                <GradientTexture
                    stops={stops as [number, ...number[]]}
                    colors={colors}
                />
            </meshBasicMaterial>
        </mesh>
    );
}

const FOG_COLORS: Record<ReturnType<typeof getTimeOfDay>, string> = {
    night: "#020810",
    dawn: "#6a6aaa",
    morning: "#3a82bc",
    day: "#2b72c8",
    evening: "#8a3060",
    dusk: "#3a1050",
};

const OCEAN_TILE_W = 400;
const OCEAN_SPEED = 0.4;
const OCEAN_TILE_XS = [-OCEAN_TILE_W, 0, OCEAN_TILE_W] as const;

function HorizonPlane() {
    const meshRefs = useRef<(THREE.Mesh | null)[]>([null, null, null]);

    const rawTexture = useTexture("/textures/ocean.png");

    const blurredTexture = useMemo(() => {
        const img = rawTexture.image as HTMLImageElement;
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.filter = "blur(1px)";
        ctx.drawImage(img, 0, 0);

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 8);
        return tex;
    }, [rawTexture]);

    // Shared across all 3 tiles — one GPU allocation
    const geo = useMemo(() => new THREE.PlaneGeometry(OCEAN_TILE_W, 1000), []);
    const mat = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                map: blurredTexture,
                color: "#4a6878",
                depthWrite: false,
            }),
        [blurredTexture],
    );

    useEffect(() => {
        return () => {
            geo.dispose();
            mat.dispose();
            blurredTexture.dispose();
            rawTexture.dispose();
        };
    }, [geo, mat, blurredTexture, rawTexture]);

    // Single useFrame instead of 3
    useFrame((_, delta) => {
        for (const mesh of meshRefs.current) {
            if (!mesh) continue;
            mesh.position.x -= OCEAN_SPEED * delta;
            if (mesh.position.x < -OCEAN_TILE_W * 1.5) {
                mesh.position.x += OCEAN_TILE_W * 3;
            }
        }
    });

    return (
        <>
            {OCEAN_TILE_XS.map((x, i) => (
                <mesh
                    key={i}
                    ref={(el) => {
                        meshRefs.current[i] = el;
                    }}
                    geometry={geo}
                    material={mat}
                    position={[x, -6, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    renderOrder={-1}
                />
            ))}
        </>
    );
}

// ─── Scene ────────────────────────────────────────────────────────
function Scene({ hour }: { hour: number }) {
    const sunPosition = getSunPosition(hour);
    const timeOfDay = getTimeOfDay(hour);
    const isNight = timeOfDay === "night";

    return (
        <>
            <fog attach="fog" args={[FOG_COLORS[timeOfDay], 100, 220]} />
            <GradientSky timeOfDay={timeOfDay} />
            <Suspense>
                <HorizonPlane />
            </Suspense>
            <ambientLight intensity={isNight ? 0.05 : 0.35} />
            {!isNight && (
                <directionalLight
                    position={sunPosition}
                    intensity={1.0}
                    color="#fff8ee"
                />
            )}
            {isNight && (
                <group position={[0, 120, 0]}>
                    <Stars
                        radius={100}
                        depth={30}
                        count={3000}
                        factor={4}
                        fade
                    />
                </group>
            )}
            <Suspense>
                <Clouds material={THREE.MeshBasicMaterial}>
                    {CLOUD_POOL.map((def) => (
                        <MovingCloud key={def.id} def={def} isNight={isNight} />
                    ))}
                </Clouds>
            </Suspense>
            <Suspense>
                <AirplaneWindow sunPosition={sunPosition} isNight={isNight} />
            </Suspense>
        </>
    );
}

useGLTF.preload("/planewindow.glb");

function WindowScene({ hour }: { hour: number }) {
    return (
        <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
                // e.preventDefault() allows the browser to attempt context restoration
                gl.domElement.addEventListener(
                    "webglcontextlost",
                    (e) => e.preventDefault(),
                    false,
                );
            }}
        >
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={20} />
            <Scene hour={hour} />
        </Canvas>
    );
}

export default memo(WindowScene);
