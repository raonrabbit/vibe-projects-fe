"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { esriZoomFromCameraDistance } from "@/shared/lib/esriMapZoom";
import { latLngToFloor, MAP_W, WORLD_MAP_SCALE } from "@/shared/lib/mapUtils";
import { TileMapPlane } from "@/shared/ui/TileMapPlane";

import { FlightSky } from "./FlightSky";
import { SessionFlightArc } from "./SessionFlightArc";

const MAP_SCALE = WORLD_MAP_SCALE;
const LIVE_SKY_DISTANCE = Math.max(3000, MAP_W * MAP_SCALE * 6);

const CAM_SIDE = 0.1;
const CAM_UP = 0.07;

const FOLLOW_DISTANCE = Math.hypot(CAM_SIDE * MAP_SCALE, CAM_UP * MAP_SCALE);
const MIN_CAM_DIST = FOLLOW_DISTANCE * 0.001;
const MAX_CAM_DIST = FOLLOW_DISTANCE * 20;

export interface CamOffset {
    x: number;
    y: number;
    z: number;
}

function computePlanePosition(
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
    progressRate?: number;
    hour: number;
    onClose: () => void;
    cameraSnapshotRef?: React.MutableRefObject<CamOffset | null>;
    showRoute?: boolean;
}

type SceneContentProps = Omit<Props, "onClose"> & {
    initPlanePos: THREE.Vector3;
    onFirstTileReady?: () => void;
};

function SceneContent({
    fromLat,
    fromLng,
    toLat,
    toLng,
    progress,
    progressRate = 0,
    hour,
    initPlanePos,
    cameraSnapshotRef,
    onFirstTileReady,
    showRoute = true,
}: SceneContentProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controlsRef = useRef<any>(null);

    // 비행기 위치 ref — SessionFlightArc가 매 프레임 갱신
    const planePositionRef = useRef(initPlanePos.clone());
    const planeHeadingRef = useRef(0);
    // 직전 프레임의 비행기 위치 — 카메라 델타 추적용
    const prevPlanePosRef = useRef(initPlanePos.clone());

    const mapZoomRef = useRef(
        esriZoomFromCameraDistance(MIN_CAM_DIST, MIN_CAM_DIST, MAX_CAM_DIST),
    );

    const offsetTemp = useRef(new THREE.Vector3());

    // 비행기 이동 델타만큼 카메라·타겟 동시 이동 — 구면각 불변 → 사용자 줌/회전 유지
    useFrame(() => {
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
            MIN_CAM_DIST,
            MAX_CAM_DIST,
            10,
        );

        // 창문뷰 복귀 시 복원을 위해 카메라 오프셋 저장
        if (cameraSnapshotRef) {
            offsetTemp.current.subVectors(
                controls.object.position,
                controls.target,
            );
            if (!cameraSnapshotRef.current) {
                cameraSnapshotRef.current = { x: 0, y: 0, z: 0 };
            }
            cameraSnapshotRef.current.x = offsetTemp.current.x;
            cameraSnapshotRef.current.y = offsetTemp.current.y;
            cameraSnapshotRef.current.z = offsetTemp.current.z;
        }
    });

    const initTarget = useMemo(
        () =>
            [initPlanePos.x, initPlanePos.y, initPlanePos.z] as [
                number,
                number,
                number,
            ],
        [],
    );

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
                zoomLevelRef={mapZoomRef}
                showRoute={showRoute}
            />
            <TileMapPlane
                centerRef={planePositionRef}
                zoomLevelRef={mapZoomRef}
                scaleXZ={MAP_SCALE}
                fogColor="#070e1a"
                onFirstTileReady={onFirstTileReady}
            />
            <OrbitControls
                ref={controlsRef}
                target={initTarget}
                enableRotate
                enableZoom
                enableDamping
                dampingFactor={0.06}
                enablePan={false}
                minDistance={MIN_CAM_DIST}
                maxDistance={MAX_CAM_DIST}
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
    cameraSnapshotRef,
    showRoute,
}: Props) {
    const [mapReady, setMapReady] = useState(false);

    // 마운트 시점의 비행기 위치 — Canvas camera + OrbitControls target 초기화에 사용
    const initPlanePos = useMemo(
        () =>
            computePlanePosition(
                fromLat,
                fromLng,
                toLat,
                toLng,
                progress,
                MAP_SCALE,
            ),
        [],
    );

    // 초기 카메라 위치: 저장된 스냅샷이 있으면 복원, 없으면 비행기 바로 위(최대 줌인)
    const initCamPosition = useMemo((): [number, number, number] => {
        if (cameraSnapshotRef?.current) {
            const { x, y, z } = cameraSnapshotRef.current;
            return [initPlanePos.x + x, initPlanePos.y + y, initPlanePos.z + z];
        }
        return [initPlanePos.x, initPlanePos.y + MIN_CAM_DIST, initPlanePos.z];
    }, []);

    return (
        <div className="absolute inset-0 z-20 bg-[#070e1a]">
            {/* 로딩 오버레이 — 첫 타일 로드 완료 시 페이드아웃 */}
            <div
                className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none bg-[#070e1a] transition-opacity duration-700 ${
                    mapReady ? "opacity-0" : "opacity-100"
                }`}
            >
                <div className="flex flex-col items-center gap-3">
                    <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-sky-400/60 animate-spin" />
                    <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase">
                        불러오는 중
                    </p>
                </div>
            </div>

            <Canvas
                camera={{
                    position: initCamPosition,
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
                    initPlanePos={initPlanePos}
                    cameraSnapshotRef={cameraSnapshotRef}
                    onFirstTileReady={() => setMapReady(true)}
                    showRoute={showRoute}
                />
            </Canvas>
        </div>
    );
}
