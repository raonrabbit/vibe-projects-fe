"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { OCEAN_SPEED, OCEAN_TILE_W, OCEAN_TILE_XS } from "./sky-constants";

const OCEAN_REPEAT_X = 2;
const OCEAN_REPEAT_Y = 5;

// How far back (z) island tiles sit relative to ocean tiles
const ISLAND_Z_OFFSET = -16;

export function HorizonPlane() {
    const meshRefs = useRef<(THREE.Mesh | null)[]>([null, null, null]);
    const isIsland = useRef<boolean[]>([false, false, false]);

    const [rawOcean, rawIsland] = useTexture([
        "/textures/ocean.png",
        "/textures/island.png",
    ]);

    const oceanTex = useMemo(() => {
        const tex = rawOcean.clone();
        tex.wrapS = THREE.MirroredRepeatWrapping;
        tex.wrapT = THREE.MirroredRepeatWrapping;
        tex.repeat.set(OCEAN_REPEAT_X, OCEAN_REPEAT_Y);
        tex.needsUpdate = true;
        return tex;
    }, [rawOcean]);

    const islandTex = useMemo(() => {
        const tex = rawIsland.clone();
        tex.wrapS = THREE.MirroredRepeatWrapping;
        tex.wrapT = THREE.MirroredRepeatWrapping;
        tex.repeat.set(OCEAN_REPEAT_X, OCEAN_REPEAT_Y);
        tex.needsUpdate = true;
        return tex;
    }, [rawIsland]);

    const alphaMap = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 256;
        const ctx = canvas.getContext("2d")!;
        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0.0, "black");
        grad.addColorStop(0.08, "black");
        grad.addColorStop(0.2, "white");
        grad.addColorStop(1.0, "white");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1, 256);
        return new THREE.CanvasTexture(canvas);
    }, []);

    const geo = useMemo(() => new THREE.PlaneGeometry(OCEAN_TILE_W, 1000), []);

    const oceanMat = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                map: oceanTex,
                alphaMap,
                color: "#1a3f5c",
                roughness: 0.8,
                metalness: 0.1,
                depthWrite: false,
                fog: false,
                transparent: true,
            }),
        [oceanTex, alphaMap],
    );

    const islandMat = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                map: islandTex,
                alphaMap,
                color: "#1a3f5c",
                roughness: 0.8,
                metalness: 0.1,
                depthWrite: false,
                fog: false,
                transparent: true,
            }),
        [islandTex, alphaMap],
    );

    useEffect(() => {
        return () => {
            geo.dispose();
            oceanMat.dispose();
            islandMat.dispose();
            alphaMap.dispose();
            oceanTex.dispose();
            islandTex.dispose();
        };
    }, [geo, oceanMat, islandMat, alphaMap, oceanTex, islandTex]);

    useFrame((_, delta) => {
        for (let i = 0; i < meshRefs.current.length; i++) {
            const mesh = meshRefs.current[i];
            if (!mesh) continue;
            mesh.position.x -= OCEAN_SPEED * delta;
            if (mesh.position.x < -OCEAN_TILE_W * 1.5) {
                mesh.position.x += OCEAN_TILE_W * 3;
                const island = Math.random() < 0.06;
                isIsland.current[i] = island;
                mesh.material = island ? islandMat : oceanMat;
                mesh.position.z = island ? ISLAND_Z_OFFSET : 0;
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
                    material={isIsland.current[i] ? islandMat : oceanMat}
                    position={[
                        x,
                        -6,
                        isIsland.current[i] ? ISLAND_Z_OFFSET : 0,
                    ]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    renderOrder={-1}
                />
            ))}
        </>
    );
}
