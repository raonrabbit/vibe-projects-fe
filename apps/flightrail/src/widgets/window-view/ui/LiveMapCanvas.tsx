"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { esriZoomFromCameraDistance } from "@/shared/lib/esriMapZoom";
import { latLngToFloor, MAP_W, WORLD_MAP_SCALE } from "@/shared/lib/mapUtils";
import { TileMapPlane } from "@/shared/ui/TileMapPlane";

import { FlightSky } from "./FlightSky";
import { SessionFlightArc } from "./SessionFlightArc";

const MAP_SCALE = WORLD_MAP_SCALE;
/** 지도 월드 스케일에 맞춘 Sky 구 반경 — 원점 고정 450이면 지도가 하늘 밖으로 나감 */
const LIVE_SKY_DISTANCE = Math.max(3000, MAP_W * MAP_SCALE * 6);

/** 비행기 오른쪽·살짝 위 (MAP_SCALE 배율 전 기준, 옆에서 비춤) */
const CAM_SIDE = 0.1;
const CAM_UP = 0.07;

function initialPlanePosition(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
    progress: number,
    mapScale: number,
): THREE.Vector3 {
    const curLat = fromLat + (toLat - fromLat) * progress;
    const curLng = fromLng + (toLng - fromLng) * progress;
    const [px, , pz] = latLngToFloor(curLat, curLng, 0, mapScale);
    const [x1, , z1] = latLngToFloor(fromLat, fromLng, 0, mapScale);
    const [x2, , z2] = latLngToFloor(toLat, toLng, 0, mapScale);
    const routeDist = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
    const midY = Math.max(0.15, routeDist * 0.008);
    const t = Math.min(Math.max(progress, 0.001), 0.999);
    const initY = 2 * (1 - t) * t * midY + 0.02;
    return new THREE.Vector3(px, initY, pz);
}

interface Props {
    fromLat: number;
    fromLng: number;
    toLat: number;
    toLng: number;
    progress: number;
    /** 초당 progress (0–1). 미전달 시 progress만 사용 */
    progressRate?: number;
    hour: number;
    onClose: () => void;
}

function SceneContent({
    fromLat,
    fromLng,
    toLat,
    toLng,
    progress,
    progressRate = 0,
    hour,
}: Omit<Props, "onClose">) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controlsRef = useRef<any>(null);
    const planePositionRef = useRef(
        initialPlanePosition(
            fromLat,
            fromLng,
            toLat,
            toLng,
            progress,
            MAP_SCALE,
        ),
    );
    const planeHeadingRef = useRef(0);
    const prevPlanePosRef = useRef(planePositionRef.current.clone());

    const followDistance = Math.hypot(CAM_SIDE * MAP_SCALE, CAM_UP * MAP_SCALE);
    const minCameraDist = followDistance * 0.001;
    const maxCameraDist = followDistance * 20;
    const mapZoomRef = useRef(
        esriZoomFromCameraDistance(
            followDistance * 0.12,
            minCameraDist,
            maxCameraDist,
        ),
    );

    // OrbitControls ref는 mount 직후 useLayoutEffect에 없을 수 있어 useFrame에서 초기화
    const camInitDone = useRef(false);
    const snapCameraToPlane = () => {
        const controls = controlsRef.current;
        if (!controls) return false;
        const pos = planePositionRef.current;
        prevPlanePosRef.current.copy(pos);
        controls.target.copy(pos);
        controls.object.position.set(
            pos.x,
            pos.y + followDistance * 0.12,
            pos.z,
        );
        controls.update();
        return true;
    };

    // 비행기 이동 델타만큼 카메라·타겟 동시 이동 — 구면각 불변 → 사용자 회전/줌 유지
    useFrame(() => {
        if (!camInitDone.current && snapCameraToPlane()) {
            camInitDone.current = true;
        }

        const controls = controlsRef.current;
        if (!controls) return;
        const pos = planePositionRef.current;
        const prev = prevPlanePosRef.current;
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        const dz = pos.z - prev.z;
        if (dx !== 0 || dy !== 0 || dz !== 0) {
            controls.target.x += dx;
            controls.target.y += dy;
            controls.target.z += dz;
            controls.object.position.x += dx;
            controls.object.position.y += dy;
            controls.object.position.z += dz;
            prev.x = pos.x;
            prev.y = pos.y;
            prev.z = pos.z;
        }

        const dist = controls.object.position.distanceTo(controls.target);
        mapZoomRef.current = esriZoomFromCameraDistance(
            dist,
            minCameraDist,
            maxCameraDist,
        );
    });

    return (
        <>
            <FlightSky
                hour={hour}
                skyDistance={LIVE_SKY_DISTANCE}
                centerOnCamera
            />
            <SessionFlightArc
                fromLat={fromLat}
                fromLng={fromLng}
                toLat={toLat}
                toLng={toLng}
                progress={progress}
                progressRate={progressRate}
                mapScale={MAP_SCALE}
                positionRef={planePositionRef}
                headingRef={planeHeadingRef}
            />
            <TileMapPlane
                centerRef={planePositionRef}
                zoomLevelRef={mapZoomRef}
                scaleXZ={MAP_SCALE}
                fogColor="#070e1a"
            />
            <OrbitControls
                ref={controlsRef}
                enableRotate
                enableZoom
                enableDamping
                dampingFactor={0.06}
                enablePan={false}
                minDistance={minCameraDist}
                maxDistance={maxCameraDist}
                minPolarAngle={0.1}
                maxPolarAngle={Math.PI / 2.05}
            />
        </>
    );
}

export default function LiveMapCanvas({
    fromLat,
    fromLng,
    toLat,
    toLng,
    progress,
    progressRate,
    hour,
}: Props) {
    return (
        <div className="absolute inset-0 z-20 bg-[#070e1a]">
            <Canvas
                camera={{
                    position: [0, 2, 3],
                    fov: 48,
                    near: 0.005,
                    far: Math.max(
                        LIVE_SKY_DISTANCE * 1.2,
                        MAP_W * MAP_SCALE * 4,
                    ),
                }}
                gl={{ antialias: true }}
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ReinhardToneMapping;
                    gl.toneMappingExposure = 0.7;
                }}
                style={{ width: "100%", height: "100%" }}
            >
                <color attach="background" args={["#0a1628"]} />
                <SceneContent
                    fromLat={fromLat}
                    fromLng={fromLng}
                    toLat={toLat}
                    toLng={toLng}
                    progress={progress}
                    progressRate={progressRate}
                    hour={hour}
                />
            </Canvas>
        </div>
    );
}
