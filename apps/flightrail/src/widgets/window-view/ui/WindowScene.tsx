"use client";

import {
    Cloud,
    Clouds,
    PerspectiveCamera,
    Sky,
    Stars,
    useGLTF,
    useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    type ComponentProps,
    memo,
    Suspense,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
} from "react";
import * as THREE from "three";

import {
    getBlend,
    getSunPosition,
    type TimeOfDay,
} from "@/shared/lib/sky-time";

// ─── Lerp helpers ─────────────────────────────────────────────────
function lerpN(a: number, b: number, t: number) {
    return a + (b - a) * t;
}
function lerpColor(a: string, b: string, t: number): string {
    return new THREE.Color(a).lerp(new THREE.Color(b), t).getStyle();
}

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

// ─── Airplane window + blind ───────────────────────────────────────
function AirplaneWindow({
    sunPosition,
    nightFactor,
    skyGlowColor,
    cabinMode,
}: {
    sunPosition: [number, number, number];
    nightFactor: number;
    skyGlowColor: string;
    cabinMode: CabinLightMode;
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
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };
    }, [clientToWorldY, gl]);

    useFrame(() => {
        const offset = blindOffsetRef.current;
        const nf = nightFactorRef.current;
        const blindOpenFactor =
            (offset - BLIND_CLOSED) / (BLIND_OPEN - BLIND_CLOSED);

        blindMeshRef.current.position.y = offset;
        handleMeshRef.current.position.y = offset - WIN_RY + HANDLE_OFFSET;
        sunLightRef.current.intensity =
            lerpN(35, 6, nf) * lerpN(0.05, 1, blindOpenFactor);
        skyGlowLightRef.current.intensity =
            lerpN(12, 3, nf) * lerpN(0.08, 1, blindOpenFactor);
    });

    const { scene } = useGLTF("/planewindow.glb");
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
    const autoCabinFactor = Math.max(
        0,
        Math.min(1, (nightFactor - 0.55) / 0.2),
    );
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
                intensity={cabinFactor * 5}
                color="#ffe896"
                distance={2.0}
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
            >
                <meshStandardMaterial
                    color="#c4bcb3"
                    roughness={0.75}
                    metalness={0}
                />
            </mesh>

            <mesh
                ref={handleMeshRef}
                geometry={handleGeo}
                position={handleInitPos}
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
    nightFactor,
}: {
    def: (typeof CLOUD_POOL)[number];
    nightFactor: number;
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
            opacity={layer.opacity * lerpN(1, 0.3, nightFactor)}
            scale={def.scale}
            seed={def.id}
            speed={0}
            bounds={layer.bounds}
            fade={0.5}
            segments={4}
        />
    );
}

const SKY_PARAMS: Record<
    TimeOfDay,
    {
        turbidity: number;
        rayleigh: number;
        mieCoefficient: number;
        mieDirectionalG: number;
    }
> = {
    night: {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
    },
    dawn: {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
    },
    morning: {
        turbidity: 6,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
    },
    day: {
        turbidity: 4,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
    },
    evening: {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
    },
    dusk: {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
    },
};

const HEMI_LIGHT: Record<
    TimeOfDay,
    { sky: string; ground: string; intensity: number }
> = {
    night: { sky: "#0a1020", ground: "#000005", intensity: 0.45 },
    dawn: { sky: "#ff8c40", ground: "#201008", intensity: 0.85 },
    morning: { sky: "#87ceeb", ground: "#8b7355", intensity: 1.0 },
    day: { sky: "#87ceeb", ground: "#8b8b6b", intensity: 1.6 },
    evening: { sky: "#ff6020", ground: "#201008", intensity: 1.0 },
    dusk: { sky: "#4020a0", ground: "#100818", intensity: 0.6 },
};

const FOG_COLORS: Record<TimeOfDay, string> = {
    night: "#020810",
    dawn: "#c07840",
    morning: "#5090c0",
    day: "#70b0e0",
    evening: "#c06030",
    dusk: "#302050",
};

// 0 = full day, 1 = full night — used to lerp lights / cloud opacity / stars
const NIGHT_FACTOR: Record<TimeOfDay, number> = {
    night: 1,
    dawn: 0.25,
    morning: 0,
    day: 0,
    evening: 0.05,
    dusk: 0.55,
};

const AMBIENT_INTENSITY: Record<TimeOfDay, number> = {
    night: 0.15,
    dawn: 0.4,
    morning: 0.7,
    day: 0.75,
    evening: 0.65,
    dusk: 0.3,
};

const SKY_GLOW: Record<TimeOfDay, string> = {
    night: "#0c1628",
    dawn: "#e06830",
    morning: "#a8c8f0",
    day: "#88b8f0",
    evening: "#c04018",
    dusk: "#3818a0",
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
            new THREE.MeshStandardMaterial({
                map: blurredTexture,
                color: "#6a8898",
                roughness: 0.8,
                metalness: 0.1,
                depthWrite: false,
                fog: false,
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

// ─── Horizon haze ─────────────────────────────────────────────────
function HorizonHaze({ color }: { color: string }) {
    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: { hazeColor: { value: new THREE.Color(color) } },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 hazeColor;
                    varying vec2 vUv;
                    void main() {
                        float d = abs(vUv.y - 0.5) * 2.0;
                        float alpha = smoothstep(1.0, 0.1, d) * 0.82;
                        gl_FragColor = vec4(hazeColor, alpha);
                    }
                `,
                transparent: true,
                depthWrite: false,
                side: THREE.DoubleSide,
            }),
        [],
    );

    useEffect(() => {
        material.uniforms.hazeColor.value.set(color);
    }, [color, material]);

    useEffect(() => () => material.dispose(), [material]);

    return (
        <mesh material={material} position={[0, -5, -85]} renderOrder={0}>
            <planeGeometry args={[600, 38]} />
        </mesh>
    );
}

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
}: {
    hour: number;
    cabinMode: CabinLightMode;
}) {
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
            </Suspense>
            <HorizonHaze color={fogColor} />
            <ambientLight intensity={ambientIntensity} />
            <hemisphereLight args={[hemi.sky, hemi.ground, hemi.intensity]} />
            <directionalLight
                position={sunPosition}
                intensity={lerpN(1.8, 0, nightFactor)}
                color="#fff8ee"
            />
            {nightFactor > 0.1 && (
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
                        <MovingCloud
                            key={def.id}
                            def={def}
                            nightFactor={nightFactor}
                        />
                    ))}
                </Clouds>
            </Suspense>
            <Suspense>
                <AirplaneWindow
                    sunPosition={sunPosition}
                    nightFactor={nightFactor}
                    skyGlowColor={skyGlowColor}
                    cabinMode={cabinMode}
                />
            </Suspense>
        </>
    );
}

useGLTF.preload("/planewindow.glb");

function WindowScene({
    hour,
    cabinMode,
}: {
    hour: number;
    cabinMode: CabinLightMode;
}) {
    return (
        <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.2;
                gl.domElement.addEventListener(
                    "webglcontextlost",
                    (e) => e.preventDefault(),
                    false,
                );
            }}
        >
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={20} />
            <Scene hour={hour} cabinMode={cabinMode} />
        </Canvas>
    );
}

export default memo(WindowScene);
