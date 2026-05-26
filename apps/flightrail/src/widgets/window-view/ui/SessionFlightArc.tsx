"use client";

import { Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { clampEsriZoom } from "@/shared/lib/esriMapZoom";
import { KM_PER_MAP_UNIT, latLngToFloor } from "@/shared/lib/mapUtils";
import { AirplaneModel } from "@/shared/ui/AirplaneModel";

const AIRCRAFT_KM = 0.033;
const TRAIL_SEGMENTS = 64;

function clampProgress(p: number) {
    return Math.min(Math.max(p, 0.001), 0.999);
}

interface Props {
    fromLat: number;
    fromLng: number;
    toLat: number;
    toLng: number;
    /** Where along the route the plane currently is (0–1); parent updates ~1 Hz */
    progress: number;
    /** 초당 progress 증가량 — 프레임마다 연속 보간 */
    progressRate?: number;
    mapScale?: number;
    positionRef?: React.MutableRefObject<THREE.Vector3>;
    headingRef?: React.MutableRefObject<number>;
    /** 줌 레벨 ref — 위치 핑 표시 여부 결정 */
    zoomLevelRef?: React.RefObject<number>;
    showRoute?: boolean;
}

export function SessionFlightArc({
    fromLat,
    fromLng,
    toLat,
    toLng,
    progress,
    progressRate = 0,
    mapScale = 1,
    positionRef,
    headingRef,
    zoomLevelRef,
    showRoute = true,
}: Props) {
    const { camera } = useThree();

    const progressSyncRef = useRef({
        progress: clampProgress(progress),
        at: performance.now(),
    });
    const yawRef = useRef(0);

    useEffect(() => {
        progressSyncRef.current = {
            progress: clampProgress(progress),
            at: performance.now(),
        };
    }, [progress]);

    const planeGroupRef = useRef<THREE.Group>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const trailLineRef = useRef<any>(null);

    const curve = useMemo(() => {
        const [x1, , z1] = latLngToFloor(fromLat, fromLng, 0, mapScale);
        const [x2, , z2] = latLngToFloor(toLat, toLng, 0, mapScale);
        const start = new THREE.Vector3(x1, 0, z1);
        const end = new THREE.Vector3(x2, 0, z2);
        const dx = x2 - x1;
        const dz = z2 - z1;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const mid = new THREE.Vector3(
            (x1 + x2) / 2,
            Math.max(0.15, dist * 0.008),
            (z1 + z2) / 2,
        );
        return new THREE.QuadraticBezierCurve3(start, mid, end);
    }, [fromLat, fromLng, toLat, toLng, mapScale]);

    // 전체 경로 — 정적, 회색
    const fullLinePoints = useMemo(() => curve.getPoints(80), [curve]);

    // trail 초기 포인트 — useFrame에서 매 프레임 덮어씌워짐
    const trailInitPoints = useMemo(() => {
        const s = curve.getPoint(0.001);
        return Array.from(
            { length: TRAIL_SEGMENTS + 1 },
            () => [s.x, s.y, s.z] as [number, number, number],
        );
    }, [curve]);

    const planeVis = useMemo(
        () => (AIRCRAFT_KM * mapScale) / KM_PER_MAP_UNIT,
        [mapScale],
    );

    // 위치 핑 ring 재질 — 각각 독립 opacity 유지를 위해 별도 인스턴스
    const pingMat1 = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color: "#7dd3fc",
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
            }),
        [],
    );
    const pingMat2 = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color: "#7dd3fc",
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
            }),
        [],
    );
    const pingRing1Ref = useRef<THREE.Mesh>(null);
    const pingRing2Ref = useRef<THREE.Mesh>(null);
    const pingPhase1 = useRef(0);
    const pingPhase2 = useRef(0.5);

    useFrame((_state, delta) => {
        const sync = progressSyncRef.current;
        const elapsedSec = (performance.now() - sync.at) / 1000;
        let p = sync.progress + progressRate * elapsedSec;
        p = clampProgress(p);

        const pos = curve.getPoint(p);
        const tangent = curve.getTangent(p);
        const group = planeGroupRef.current;
        if (group) {
            group.position.set(pos.x, pos.y + 0.02, pos.z);
            const targetYaw = Math.atan2(-tangent.z, tangent.x);
            const yawSmooth = 1 - Math.exp(-12 * delta);
            yawRef.current = THREE.MathUtils.lerp(
                yawRef.current,
                targetYaw,
                yawSmooth,
            );
            group.rotation.y = yawRef.current;
        }
        if (positionRef) {
            positionRef.current.set(pos.x, pos.y + 0.02, pos.z);
        }
        if (headingRef) {
            headingRef.current = yawRef.current;
        }

        // trail 포인트 업데이트 (drei Line 임페러티브 갱신)
        if (trailLineRef.current) {
            const flatPos: number[] = [];
            for (let i = 0; i <= TRAIL_SEGMENTS; i++) {
                const pt = curve.getPoint((i / TRAIL_SEGMENTS) * p);
                flatPos.push(pt.x, pt.y, pt.z);
            }
            trailLineRef.current.geometry.setPositions(flatPos);
        }

        // 위치 핑 — zoom 15 미만일 때 표시 (카메라 거리 비례 크기)
        const zoom = zoomLevelRef
            ? clampEsriZoom(zoomLevelRef.current as number)
            : 18;
        const showPing = zoom < 15;
        const distToPlane = camera.position.distanceTo(pos);
        const maxR = distToPlane * 0.13;

        pingPhase1.current = (pingPhase1.current + delta * 0.55) % 1;
        pingPhase2.current = (pingPhase2.current + delta * 0.55) % 1;

        const updatePingRing = (
            meshRef: React.RefObject<THREE.Mesh | null>,
            mat: THREE.MeshBasicMaterial,
            phase: number,
        ) => {
            const mesh = meshRef.current;
            if (!mesh) return;
            mesh.visible = showPing;
            if (!showPing) return;
            mesh.position.set(pos.x, 0.005, pos.z);
            mesh.scale.setScalar(Math.max(0.001, phase * maxR));
            mat.opacity = (1 - phase) * 0.72;
        };

        updatePingRing(pingRing1Ref, pingMat1, pingPhase1.current);
        updatePingRing(pingRing2Ref, pingMat2, pingPhase2.current);
    });

    return (
        <group>
            {showRoute && (
                <Line
                    points={fullLinePoints}
                    color="#94a3b8"
                    lineWidth={1.5}
                    transparent
                    opacity={0.4}
                />
            )}

            {/* 진행 trail — 밝은 하늘색, 두꺼운 선 */}
            <Line
                ref={trailLineRef}
                points={trailInitPoints}
                color="#93c5fd"
                lineWidth={2.5}
                transparent
                opacity={0.9}
            />

            <group ref={planeGroupRef}>
                <group scale={[planeVis, planeVis, planeVis]}>
                    <AirplaneModel orientation="horizontal-floor" size={1} />
                </group>
            </group>

            {/* 위치 핑 — 줌아웃 시 비행기 위치 표시 */}
            <mesh
                ref={pingRing1Ref}
                rotation={[-Math.PI / 2, 0, 0]}
                renderOrder={4}
                visible={false}
            >
                <ringGeometry args={[0.82, 1, 40]} />
                <primitive object={pingMat1} attach="material" />
            </mesh>
            <mesh
                ref={pingRing2Ref}
                rotation={[-Math.PI / 2, 0, 0]}
                renderOrder={4}
                visible={false}
            >
                <ringGeometry args={[0.82, 1, 40]} />
                <primitive object={pingMat2} attach="material" />
            </mesh>
        </group>
    );
}
