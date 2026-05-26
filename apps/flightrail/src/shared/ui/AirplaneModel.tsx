"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

const AIRPLANE_GLB = "/models/Airplane.glb";

/** vertical-map: 홈 MapScene (XY 평면, rotation.z) · horizontal-floor: 지도 뷰 (XZ 바닥, rotation.y) */
export type AirplaneOrientation = "vertical-map" | "horizontal-floor";

const ORIENTATION_ROTATION: Record<
    AirplaneOrientation,
    [number, number, number]
> = {
    "vertical-map": [-Math.PI / 2, Math.PI / 2, 0],
    "horizontal-floor": [0, Math.PI / 2, 0],
};

interface AirplaneModelProps {
    orientation: AirplaneOrientation;
    size?: number;
    lightColor?: string;
    lightIntensity?: number;
    lightDistance?: number;
}

export function AirplaneModel({
    orientation,
    size = 0.14,
}: AirplaneModelProps) {
    const { scene } = useGLTF(AIRPLANE_GLB);
    const model = useMemo(() => scene.clone(true), [scene]);
    const rotation = ORIENTATION_ROTATION[orientation];

    const { uniformScale, centerOffset } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(model);
        const sizeVec = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(sizeVec);
        box.getCenter(center);
        const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z, 1e-6);
        return {
            uniformScale: size / maxDim,
            centerOffset: center.multiplyScalar(-1),
        };
    }, [model, size]);

    return (
        <group scale={uniformScale}>
            <group position={centerOffset}>
                <group rotation={rotation}>
                    <primitive object={model} />
                </group>
            </group>
        </group>
    );
}

useGLTF.preload(AIRPLANE_GLB);
