"use client";

// Map tiles © Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { clampEsriZoom } from "@/shared/lib/esriMapZoom";
import { MAP_H, MAP_W } from "@/shared/lib/mapUtils";

const TILE_SIZE = 256;
/** fetchTileCanvas에서 허용하는 최대 타일 수 (rows×cols, 25×25) */
const MAX_TILES = 625;
/** 합성 텍스처 최대 한 변(px) — 줌 아웃 기본 */
const TEX_MAX = 2048;
/** 고줌 인 합성 시 선명도용 상한 */
const TEX_MAX_CLOSE = 4096;
/** 안개 원 반경 배율 (1=지도 모서리까지, 낮출수록 원이 작아짐) */
const FOG_RADIUS_SCALE = 0.68;

/** Esri z가 높을수록(줌 인) 타일 1장의 지리 범위가 작아지므로 pad를 키워 넓게 깐다 */
function zoomToPad(zoom: number): number {
    if (zoom <= 4) return 10; // 21×21
    if (zoom <= 6) return 9; // 19×19
    if (zoom <= 8) return 8; // 17×17
    if (zoom <= 10) return 8; // 17×17
    if (zoom <= 12) return 10; // 21×21 (고줌 인 직전)
    if (zoom <= 14) return 11; // 23×23
    return 12; // z≥15, 최대 줌 인 근처: 25×25
}

const tileUrl = (z: number, y: number, x: number) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;

function lng2tile(lng: number, z: number) {
    return Math.floor(((lng + 180) / 360) * 2 ** z);
}

function lat2tile(lat: number, z: number) {
    const rad = (lat * Math.PI) / 180;
    return Math.floor(
        ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) *
            2 ** z,
    );
}

function tile2lat(ty: number, zoom: number): number {
    const n = Math.PI - (2 * Math.PI * ty) / 2 ** zoom;
    return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

function texMaxForZoom(zoom: number): number {
    if (zoom >= 15) return TEX_MAX_CLOSE;
    if (zoom >= 12) return 3072;
    return TEX_MAX;
}

// txMin/txMax/tyMin/tyMax를 직접 받아 off-by-one 없이 타일 수 계산
async function fetchTileCanvas(
    txMin: number,
    txMax: number,
    tyMin: number,
    tyMax: number,
    zoom: number,
    lngMin: number,
    lngMax: number,
    latMin: number,
    latMax: number,
): Promise<HTMLCanvasElement | null> {
    const latSpan = latMax - latMin;
    const lngSpan = lngMax - lngMin;
    if (lngSpan <= 0 || latSpan <= 0 || lngSpan > 180) return null;

    const cols = txMax - txMin + 1;
    const rows = tyMax - tyMin + 1;
    if (rows * cols > MAX_TILES) return null;

    const mercCanvas = document.createElement("canvas");
    mercCanvas.width = cols * TILE_SIZE;
    mercCanvas.height = rows * TILE_SIZE;
    const mercCtx = mercCanvas.getContext("2d")!;

    const IMG_TIMEOUT_MS = 8000;

    await Promise.all(
        Array.from({ length: rows * cols }, (_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                let settled = false;
                const timer = setTimeout(() => {
                    if (!settled) {
                        settled = true;
                        resolve();
                    }
                }, IMG_TIMEOUT_MS);
                img.onload = () => {
                    if (!settled) {
                        settled = true;
                        clearTimeout(timer);
                        mercCtx.drawImage(
                            img,
                            col * TILE_SIZE,
                            row * TILE_SIZE,
                        );
                    }
                    resolve();
                };
                img.onerror = () => {
                    if (!settled) {
                        settled = true;
                        clearTimeout(timer);
                    }
                    resolve();
                };
                img.src = tileUrl(zoom, tyMin + row, txMin + col);
            });
        }),
    );

    const texCap = texMaxForZoom(zoom);
    const outW = Math.min(texCap, cols * TILE_SIZE);
    const outH = Math.min(texCap, rows * TILE_SIZE);
    const outCanvas = document.createElement("canvas");
    outCanvas.width = outW;
    outCanvas.height = outH;
    const outCtx = outCanvas.getContext("2d")!;

    const tileN = 2 ** zoom;
    const srcXStart =
        ((lngMin + 180) / 360) * tileN * TILE_SIZE - txMin * TILE_SIZE;
    const srcXEnd =
        ((lngMax + 180) / 360) * tileN * TILE_SIZE - txMin * TILE_SIZE;
    const srcW = srcXEnd - srcXStart;

    for (let s = 0; s < 128; s++) {
        const t0 = s / 128;
        const t1 = (s + 1) / 128;
        const lat1 = latMax - t0 * latSpan;
        const lat2 = latMax - t1 * latSpan;
        const r1 = (lat1 * Math.PI) / 180;
        const r2 = (lat2 * Math.PI) / 180;
        const mercY1 =
            ((1 - Math.log(Math.tan(r1) + 1 / Math.cos(r1)) / Math.PI) / 2) *
                tileN *
                TILE_SIZE -
            tyMin * TILE_SIZE;
        const mercY2 =
            ((1 - Math.log(Math.tan(r2) + 1 / Math.cos(r2)) / Math.PI) / 2) *
                tileN *
                TILE_SIZE -
            tyMin * TILE_SIZE;
        outCtx.drawImage(
            mercCanvas,
            srcXStart,
            mercY1,
            srcW,
            mercY2 - mercY1,
            0,
            t0 * outH,
            outW,
            (t1 - t0) * outH,
        );
    }

    mercCanvas.width = 0; // release GPU backing store immediately
    return outCanvas;
}

function tileBounds(centerLng: number, centerLat: number, zoom: number) {
    const n = 2 ** zoom;
    const pad = zoomToPad(zoom);
    const txC = lng2tile(centerLng, zoom);
    const tyC = lat2tile(centerLat, zoom);
    const txMin = Math.max(txC - pad, 0);
    const txMax = Math.min(txC + pad, n - 1);
    const tyMin = Math.max(tyC - pad, 0);
    const tyMax = Math.min(tyC + pad, n - 1);
    const lngMin = (txMin / n) * 360 - 180;
    const lngMax = ((txMax + 1) / n) * 360 - 180;
    const latMin = tile2lat(tyMax + 1, zoom);
    const latMax = tile2lat(tyMin, zoom);
    return {
        txC,
        tyC,
        txMin,
        txMax,
        tyMin,
        tyMax,
        lngMin,
        lngMax,
        latMin,
        latMax,
    };
}

const PLACEHOLDER_TEX = (() => {
    const data = new Uint8Array([28, 42, 62, 255]);
    const tex = new THREE.DataTexture(data, 1, 1);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
})();

type MapFogUniforms = {
    airplanePos: { value: THREE.Vector3 };
    fadeRadius: { value: number };
    fogColor: { value: THREE.Color };
};

function attachMapFogShader(
    mat: THREE.MeshBasicMaterial,
    uniforms: MapFogUniforms,
) {
    mat.transparent = true;
    mat.depthWrite = false;
    mat.onBeforeCompile = (shader) => {
        shader.uniforms.uPlanePos = uniforms.airplanePos;
        shader.uniforms.uFadeR = uniforms.fadeRadius;
        shader.uniforms.uFogCol = uniforms.fogColor;

        shader.vertexShader =
            "varying vec3 vTileWorldPos;\n" +
            shader.vertexShader.replace(
                "#include <project_vertex>",
                `#ifdef USE_INSTANCING
                    vTileWorldPos = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
                #else
                    vTileWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
                #endif
                #include <project_vertex>`,
            );

        shader.fragmentShader =
            "uniform vec3 uPlanePos;\nuniform float uFadeR;\nuniform vec3 uFogCol;\nvarying vec3 vTileWorldPos;\n" +
            shader.fragmentShader.replace(
                "#include <map_fragment>",
                `#include <map_fragment>
                float d = distance(vTileWorldPos.xz, uPlanePos.xz);
                float edge = smoothstep(uFadeR * 0.5, uFadeR * 0.96, d);
                diffuseColor.a *= (1.0 - edge);
                diffuseColor.rgb = mix(diffuseColor.rgb, uFogCol, edge * 0.92);`,
            );
    };
    mat.customProgramCacheKey = () => "tile-map-plane-fog-v3";
}

interface Props {
    centerRef: React.RefObject<THREE.Vector3>;
    /** Esri 줌 레벨 2~18 (LiveMapCanvas가 휠 줌에 맞춰 갱신) */
    zoomLevelRef: React.RefObject<number>;
    scaleXZ?: number;
    /** 안개가 섞일 색 (기본: LiveMapCanvas 배경) */
    fogColor?: string;
}

interface PendingTile {
    canvas: HTMLCanvasElement;
    lngMin: number;
    lngMax: number;
    latMin: number;
    latMax: number;
}

export function TileMapPlane({
    centerRef,
    zoomLevelRef,
    scaleXZ = 1,
    fogColor = "#0a1628",
}: Props) {
    const meshRef = useRef<THREE.Mesh>(null);
    const fogUniformsRef = useRef<MapFogUniforms>({
        airplanePos: { value: new THREE.Vector3() },
        fadeRadius: { value: 40 },
        fogColor: { value: new THREE.Color(fogColor) },
    });
    const mapMaterial = useMemo(() => {
        const mat = new THREE.MeshBasicMaterial({
            map: PLACEHOLDER_TEX,
            toneMapped: false,
        });
        attachMapFogShader(mat, fogUniformsRef.current);
        return mat;
    }, []);
    const mapMetaRef = useRef({ cx: 0, cz: 0, w: 1, d: 1 });
    const fetchIdRef = useRef(0);
    const lastKeyRef = useRef("");
    const pendingRef = useRef<PendingTile | null>(null);
    const xF = ((MAP_W / 2) * scaleXZ) / 180;
    const zF = ((MAP_H / 2) * scaleXZ) / 90;

    useEffect(() => {
        fogUniformsRef.current.fogColor.value.set(fogColor);
    }, [fogColor]);

    function updateFogRadius(center: THREE.Vector3) {
        const { cx, cz, w, d } = mapMetaRef.current;
        const hw = w / 2;
        const hd = d / 2;
        const dx = Math.abs(center.x - cx) + hw;
        const dz = Math.abs(center.z - cz) + hd;
        fogUniformsRef.current.fadeRadius.value =
            Math.hypot(dx, dz) * FOG_RADIUS_SCALE;
        fogUniformsRef.current.airplanePos.value.copy(center);
    }

    useFrame(() => {
        const center = centerRef.current;
        if (!center) return;

        // 페치 완료된 타일을 프레임 시작 시점에 안전하게 적용
        const pending = pendingRef.current;
        if (pending) {
            pendingRef.current = null;
            const mesh = meshRef.current;
            if (mesh) {
                const planeW = (pending.lngMax - pending.lngMin) * xF;
                const planeD = (pending.latMax - pending.latMin) * zF;
                const cx = ((pending.lngMin + pending.lngMax) / 2) * xF;
                const cz = -((pending.latMin + pending.latMax) / 2) * zF;
                mapMetaRef.current = { cx, cz, w: planeW, d: planeD };
                mesh.position.set(cx, 0, cz);
                mesh.geometry.dispose();
                mesh.geometry = new THREE.PlaneGeometry(planeW, planeD);
                const oldTex = mapMaterial.map;
                const tex = new THREE.CanvasTexture(pending.canvas);
                tex.colorSpace = THREE.SRGBColorSpace;
                mapMaterial.map = tex;
                mapMaterial.needsUpdate = true;
                if (oldTex && oldTex !== PLACEHOLDER_TEX) oldTex.dispose();
                updateFogRadius(center);
                mesh.visible = true;
            }
        }

        updateFogRadius(center);

        const zoom = clampEsriZoom(zoomLevelRef.current);

        const centerLng = Math.max(-180, Math.min(180, center.x / xF));
        const centerLat = Math.max(-85, Math.min(85, -center.z / zF));

        const b = tileBounds(centerLng, centerLat, zoom);
        const key = `${zoom}:${b.txC}:${b.tyC}`;
        if (key === lastKeyRef.current) return;
        lastKeyRef.current = key;

        const myId = ++fetchIdRef.current;

        fetchTileCanvas(
            b.txMin,
            b.txMax,
            b.tyMin,
            b.tyMax,
            zoom,
            b.lngMin,
            b.lngMax,
            b.latMin,
            b.latMax,
        )
            .then((canvas) => {
                if (myId !== fetchIdRef.current) return;
                if (!canvas) {
                    lastKeyRef.current = "";
                    return;
                }
                pendingRef.current = {
                    canvas,
                    lngMin: b.lngMin,
                    lngMax: b.lngMax,
                    latMin: b.latMin,
                    latMax: b.latMax,
                };
            })
            .catch(() => {
                if (myId === fetchIdRef.current) lastKeyRef.current = "";
            });
    });

    return (
        <mesh
            ref={meshRef}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={2}
            visible={false}
        >
            <planeGeometry args={[1, 1]} />
            <primitive object={mapMaterial} attach="material" />
        </mesh>
    );
}
