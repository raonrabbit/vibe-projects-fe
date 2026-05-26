"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { KM_PER_MAP_UNIT, latLngToFloor } from "@/shared/lib/mapUtils";

// 실제 비행기 길이 (Boeing 737 기준)
const AIRCRAFT_KM = 0.033;
import { AirplaneModel } from "@/shared/ui/AirplaneModel";

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
}: Props) {
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

    const trailGeo = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array((TRAIL_SEGMENTS + 1) * 3);
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return geo;
    }, []);

    useEffect(
        () => () => {
            trailGeo.dispose();
        },
        [trailGeo],
    );

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

    const fullLine = useMemo(() => {
        const geom = new THREE.BufferGeometry().setFromPoints(
            curve.getPoints(120),
        );
        const mat = new THREE.LineBasicMaterial({
            color: "#3b82f6",
            transparent: true,
            opacity: 0.18,
        });
        return new THREE.Line(geom, mat);
    }, [curve]);

    // 실제 스케일: 비행기 길이(km) / (지도 1unit당 km)
    const planeVis = useMemo(
        () => (AIRCRAFT_KM * mapScale) / KM_PER_MAP_UNIT,
        [mapScale],
    );

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

        const posAttr = trailGeo.getAttribute(
            "position",
        ) as THREE.BufferAttribute;
        for (let i = 0; i <= TRAIL_SEGMENTS; i++) {
            const pt = curve.getPoint((i / TRAIL_SEGMENTS) * p);
            posAttr.setXYZ(i, pt.x, pt.y, pt.z);
        }
        posAttr.needsUpdate = true;
    });

    return (
        <group>
            <primitive object={fullLine} />

            <line>
                <primitive object={trailGeo} attach="geometry" />
                <lineBasicMaterial color="#60a5fa" transparent opacity={0.75} />
            </line>

            <group ref={planeGroupRef}>
                <group scale={[planeVis, planeVis, planeVis]}>
                    <AirplaneModel orientation="horizontal-floor" size={1} />
                </group>
            </group>
        </group>
    );
}
