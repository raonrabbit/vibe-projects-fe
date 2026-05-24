"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { lerpN, OCEAN_SPEED, OCEAN_TILE_W } from "./sky-constants";

const CLOUD_COUNT = 260;
const VOLUME_LAYERS = 5;
const TEXTURE_VARIANTS = 5;
const PLANE_SIZE = 88;
const WRAP_X = OCEAN_TILE_W * 3;
const WRAP_MIN = -WRAP_X / 2;
const OCEAN_Y = -6;
const Z_NEAR = -15;
const Z_FAR = -780;

type CloudDef = {
    x: number;
    y: number;
    z: number;
    layer: number;
    rz: number;
    tiltX: number;
    tiltY: number;
    scale: number;
    opacity: number;
    spin: number;
    texIdx: number;
};

function hash(i: number, n: number) {
    const v = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return v - Math.floor(v);
}

function buildCloudDefs(): CloudDef[] {
    const defs: CloudDef[] = [];
    const zSpan = Z_FAR - Z_NEAR;

    for (let i = 0; i < CLOUD_COUNT; i++) {
        const layer = Math.floor(hash(i, 0) * VOLUME_LAYERS);
        const layerY = OCEAN_Y + 0.52 + layer * 0.26;
        const z = Z_NEAR + hash(i, 2) * zSpan;
        const depthT = (z - Z_NEAR) / zSpan;

        defs.push({
            x: WRAP_MIN + hash(i, 1) * WRAP_X,
            y: layerY + (hash(i, 3) - 0.5) * 0.28,
            z,
            layer,
            rz: hash(i, 4) * Math.PI * 2,
            tiltX: 0.06 + hash(i, 5) * 0.14,
            tiltY: (hash(i, 6) - 0.5) * 0.22,
            scale: 0.58 + hash(i, 7) * 0.42 + layer * 0.03,
            opacity: 0.34 + layer * 0.04 + hash(i, 8) * 0.14 - depthT * 0.1,
            spin: (hash(i, 9) - 0.5) * 0.35,
            texIdx: Math.floor(hash(i, 10) * TEXTURE_VARIANTS),
        });
    }

    return defs;
}

// Each variant has distinct blob arrangement so adjacent clouds look different.
const CLOUD_BLOB_VARIANTS: Array<Array<[number, number, number]>> = [
    // 0: Three puffs in a row
    [
        [0.3, 0.52, 0.26],
        [0.55, 0.46, 0.32],
        [0.76, 0.52, 0.22],
    ],
    // 1: Single dominant puff with flanking buds
    [
        [0.5, 0.5, 0.38],
        [0.33, 0.56, 0.18],
        [0.67, 0.55, 0.17],
    ],
    // 2: Wide horizontal spread
    [
        [0.22, 0.5, 0.2],
        [0.44, 0.48, 0.3],
        [0.64, 0.52, 0.25],
        [0.82, 0.5, 0.17],
    ],
    // 3: Compact round cluster
    [
        [0.5, 0.5, 0.36],
        [0.36, 0.43, 0.2],
        [0.63, 0.44, 0.19],
        [0.5, 0.6, 0.16],
    ],
    // 4: Two main puffs side by side
    [
        [0.34, 0.48, 0.3],
        [0.66, 0.52, 0.28],
        [0.5, 0.43, 0.18],
    ],
];

function createCloudTexture(variant: number) {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);

    const blobs = CLOUD_BLOB_VARIANTS[variant];
    for (const [cx, cy, r] of blobs) {
        const g = ctx.createRadialGradient(
            cx * size,
            cy * size,
            0,
            cx * size,
            cy * size,
            r * size,
        );
        g.addColorStop(0, "rgba(255,255,255,0.98)");
        g.addColorStop(0.38, "rgba(255,255,255,0.62)");
        g.addColorStop(0.7, "rgba(255,255,255,0.18)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

export function CloudLayer({ nightFactor }: { nightFactor: number }) {
    const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
    const spinRef = useRef(0);
    const defs = useMemo(() => buildCloudDefs(), []);
    const textures = useMemo(
        () =>
            Array.from({ length: TEXTURE_VARIANTS }, (_, v) =>
                createCloudTexture(v),
            ),
        [],
    );
    const geo = useMemo(
        () => new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE),
        [],
    );

    const materials = useMemo(
        () =>
            defs.map((d) => {
                const m = new THREE.MeshLambertMaterial({
                    map: textures[d.texIdx],
                    transparent: true,
                    opacity: d.opacity,
                    depthWrite: false,
                    fog: false,
                });
                return m;
            }),
        [defs, textures],
    );

    useEffect(() => {
        return () => {
            geo.dispose();
            for (const t of textures) t.dispose();
            for (const m of materials) m.dispose();
        };
    }, [geo, textures, materials]);

    useFrame((_, delta) => {
        spinRef.current += delta * 0.12;
        const opacityMul = lerpN(1, 0.32, nightFactor);

        for (let i = 0; i < meshRefs.current.length; i++) {
            const mesh = meshRefs.current[i];
            if (!mesh) continue;
            const d = defs[i];

            const parallax = 0.88 + d.layer * 0.035;
            mesh.position.x -= OCEAN_SPEED * delta * parallax;
            if (mesh.position.x < WRAP_MIN) mesh.position.x += WRAP_X;

            mesh.rotation.set(
                -Math.PI / 2 + d.tiltX,
                d.tiltY,
                d.rz + spinRef.current * d.spin,
            );

            const mat = mesh.material as THREE.MeshLambertMaterial;
            mat.opacity = Math.min(0.72, d.opacity * opacityMul);
        }
    });

    return (
        <>
            {defs.map((d, i) => (
                <mesh
                    key={i}
                    ref={(el) => {
                        meshRefs.current[i] = el;
                    }}
                    geometry={geo}
                    material={materials[i]}
                    position={[d.x, d.y, d.z]}
                    rotation={[-Math.PI / 2 + d.tiltX, d.tiltY, d.rz]}
                    scale={[d.scale, d.scale, 1]}
                    renderOrder={Math.round(-d.z)}
                />
            ))}
        </>
    );
}
