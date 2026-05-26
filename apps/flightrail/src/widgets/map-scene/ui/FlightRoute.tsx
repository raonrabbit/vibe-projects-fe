"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import {
    haversineKm,
    latLngTo3D,
    planeWorldScaleForRoute,
} from "@/shared/lib/mapUtils";
import { AirplaneModel } from "@/shared/ui/AirplaneModel";

interface FlightRouteProps {
    fromLat: number;
    fromLng: number;
    toLat: number;
    toLng: number;
    mapScale?: number;
    color?: string;
    speed?: number;
    initialProgress?: number;
}

export function FlightRoute({
    fromLat,
    fromLng,
    toLat,
    toLng,
    mapScale = 1,
    color = "#3b82f6",
    speed = 1,
    initialProgress = 0,
}: FlightRouteProps) {
    const groupRef = useRef<THREE.Group>(null);
    const progressRef = useRef(initialProgress % 1);

    const { curve, linePoints } = useMemo(() => {
        const [x1, y1] = latLngTo3D(fromLat, fromLng, 0.05, mapScale);
        const [x2, y2] = latLngTo3D(toLat, toLng, 0.05, mapScale);

        const start = new THREE.Vector3(x1, y1, 0.05);
        const end = new THREE.Vector3(x2, y2, 0.05);
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mid = new THREE.Vector3(
            (x1 + x2) / 2,
            (y1 + y2) / 2,
            Math.max(0.3, dist * 0.08),
        );

        const c = new THREE.QuadraticBezierCurve3(start, mid, end);
        return { curve: c, linePoints: c.getPoints(100) };
    }, [fromLat, fromLng, toLat, toLng, mapScale]);

    const routeKm = useMemo(
        () => haversineKm(fromLat, fromLng, toLat, toLng),
        [fromLat, fromLng, toLat, toLng],
    );

    const routeMapUnits = useMemo(() => {
        const [x1, y1] = latLngTo3D(fromLat, fromLng, 0.05, mapScale);
        const [x2, y2] = latLngTo3D(toLat, toLng, 0.05, mapScale);
        return Math.hypot(x2 - x1, y2 - y1);
    }, [fromLat, fromLng, toLat, toLng, mapScale]);

    const planeSize = useMemo(
        () => planeWorldScaleForRoute(routeKm, routeMapUnits, mapScale),
        [routeKm, routeMapUnits, mapScale],
    );

    const lineMesh = useMemo(() => {
        const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
        const material = new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.45,
        });
        return new THREE.Line(geometry, material);
    }, [linePoints, color]);

    useFrame((_, delta) => {
        progressRef.current = (progressRef.current + delta * speed * 0.025) % 1;
        const group = groupRef.current;
        if (!group) return;

        const t = progressRef.current;
        const pos = curve.getPoint(t);
        const tangent = curve.getTangent(t);

        group.position.copy(pos);
        group.rotation.z = Math.atan2(tangent.y, tangent.x);
    });

    return (
        <group>
            {/* Arc line — use primitive to avoid JSX conflict with SVG <line> */}
            <primitive object={lineMesh} />

            <group ref={groupRef}>
                <AirplaneModel
                    orientation="vertical-map"
                    size={planeSize}
                    lightColor={color}
                />
            </group>
        </group>
    );
}
