"use client";

// Map tiles © Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { clampEsriZoom } from "@/shared/lib/esriMapZoom";
import { MAP_H, MAP_W } from "@/shared/lib/mapUtils";

const TILE_SIZE = 256;
/** 링당 최대 타일 수 */
const MAX_TILES_PER_RING = 256;
/** 안개 원 반경 배율 */
const FOG_RADIUS_SCALE = 0.68;
/** 타일 배치 크기 — 브라우저 동시 연결 수에 맞춤 */
const FETCH_BATCH_SIZE = 6;

/**
 * LOD 3-ring: inner(고품질·좁은 범위) → outer(저품질·넓은 범위)
 * 각 ring은 현재 줌에서 zoomOffset을 뺀 레벨로 독립 fetch.
 * renderOrder: inner(3)가 가장 위에 렌더링되어 하위 ring이 투명 가장자리로 보임.
 */
const LOD_TIERS_DESKTOP = [
    { zoomOffset: 0, pad: 7, texMax: 2048, renderOrder: 3 }, // 비행기 직하방 고품질
    { zoomOffset: -3, pad: 5, texMax: 1024, renderOrder: 2 }, // 중거리
    { zoomOffset: -6, pad: 6, texMax: 1024, renderOrder: 1 }, // 광역
] as const;

// 모바일: 타일 수(pad)와 텍스처 해상도(texMax)를 절반 수준으로 낮춰 네트워크·GPU 부하 감소
const LOD_TIERS_MOBILE = [
    { zoomOffset: 0, pad: 4, texMax: 1024, renderOrder: 3 },
    { zoomOffset: -3, pad: 3, texMax: 512, renderOrder: 2 },
    { zoomOffset: -6, pad: 4, texMax: 512, renderOrder: 1 },
] as const;

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

/**
 * 타일을 FETCH_BATCH_SIZE씩 순차 로드.
 * onProgress: 배치 완료마다 저해상도 preview 캔버스를 전달.
 * 반환값: 최종 full-quality 캔버스 (null = 범위 초과 등 실패).
 */
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
    texMax: number,
    onProgress?: (canvas: HTMLCanvasElement) => void,
): Promise<HTMLCanvasElement | null> {
    const latSpan = latMax - latMin;
    const lngSpan = lngMax - lngMin;
    if (lngSpan <= 0 || latSpan <= 0 || lngSpan > 180) return null;

    const cols = txMax - txMin + 1;
    const rows = tyMax - tyMin + 1;
    if (rows * cols > MAX_TILES_PER_RING) return null;

    const tileN = 2 ** zoom;
    const srcXStart =
        ((lngMin + 180) / 360) * tileN * TILE_SIZE - txMin * TILE_SIZE;
    const srcXEnd =
        ((lngMax + 180) / 360) * tileN * TILE_SIZE - txMin * TILE_SIZE;
    const srcW = srcXEnd - srcXStart;

    const mercCanvas = document.createElement("canvas");
    mercCanvas.width = cols * TILE_SIZE;
    mercCanvas.height = rows * TILE_SIZE;
    const mercCtx = mercCanvas.getContext("2d")!;

    /** mercCanvas → equirectangular 재투영 */
    function reprojectTo(
        ctx: CanvasRenderingContext2D,
        w: number,
        h: number,
        strips: number,
    ) {
        for (let s = 0; s < strips; s++) {
            const t0 = s / strips;
            const t1 = (s + 1) / strips;
            const lat1 = latMax - t0 * latSpan;
            const lat2 = latMax - t1 * latSpan;
            const r1 = (lat1 * Math.PI) / 180;
            const r2 = (lat2 * Math.PI) / 180;
            const mercY1 =
                ((1 - Math.log(Math.tan(r1) + 1 / Math.cos(r1)) / Math.PI) /
                    2) *
                    tileN *
                    TILE_SIZE -
                tyMin * TILE_SIZE;
            const mercY2 =
                ((1 - Math.log(Math.tan(r2) + 1 / Math.cos(r2)) / Math.PI) /
                    2) *
                    tileN *
                    TILE_SIZE -
                tyMin * TILE_SIZE;
            ctx.drawImage(
                mercCanvas,
                srcXStart,
                mercY1,
                srcW,
                mercY2 - mercY1,
                0,
                t0 * h,
                w,
                (t1 - t0) * h,
            );
        }
    }

    // 중간 preview 캔버스 — 작은 사이즈로 GPU 부하 최소화
    let progCanvas: HTMLCanvasElement | null = null;
    let progCtx: CanvasRenderingContext2D | null = null;
    if (onProgress) {
        const PROG_MAX = Math.min(512, texMax);
        progCanvas = document.createElement("canvas");
        progCanvas.width = PROG_MAX;
        progCanvas.height = Math.max(
            1,
            Math.round((PROG_MAX * latSpan) / lngSpan),
        );
        progCtx = progCanvas.getContext("2d");
    }

    const IMG_TIMEOUT_MS = 8000;
    const allTiles = Array.from({ length: rows * cols }, (_, i) => ({
        row: Math.floor(i / cols),
        col: i % cols,
    }));

    for (let b = 0; b < allTiles.length; b += FETCH_BATCH_SIZE) {
        await Promise.all(
            allTiles.slice(b, b + FETCH_BATCH_SIZE).map(
                ({ row, col }) =>
                    new Promise<void>((resolve) => {
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
                    }),
            ),
        );

        if (onProgress && progCanvas && progCtx) {
            progCtx.clearRect(0, 0, progCanvas.width, progCanvas.height);
            reprojectTo(progCtx, progCanvas.width, progCanvas.height, 32);
            onProgress(progCanvas);
        }
    }

    // 최종 full-quality 출력
    const outW = Math.min(texMax, cols * TILE_SIZE);
    const outH = Math.min(texMax, rows * TILE_SIZE);
    const outCanvas = document.createElement("canvas");
    outCanvas.width = outW;
    outCanvas.height = outH;
    const outCtx = outCanvas.getContext("2d")!;
    reprojectTo(outCtx, outW, outH, 128);

    mercCanvas.width = 0;
    return outCanvas;
}

function tileBounds(
    centerLng: number,
    centerLat: number,
    zoom: number,
    pad: number,
) {
    const n = 2 ** zoom;
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

// cacheKeySuffix로 ring별 WebGL 프로그램을 분리 → 각 ring의 uniform이 독립 유지됨
function attachMapFogShader(
    mat: THREE.MeshBasicMaterial,
    uniforms: MapFogUniforms,
    cacheKeySuffix: string,
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
    mat.customProgramCacheKey = () => `tile-map-plane-fog-v3-${cacheKeySuffix}`;
}

interface PendingTile {
    canvas: HTMLCanvasElement;
    lngMin: number;
    lngMax: number;
    latMin: number;
    latMax: number;
}

interface TileRingProps {
    centerRef: React.RefObject<THREE.Vector3>;
    zoomLevelRef: React.RefObject<number>;
    scaleXZ: number;
    fogColor: string;
    zoomOffset: number;
    pad: number;
    texMax: number;
    renderOrder: number;
    onFirstVisible?: () => void;
}

function TileRing({
    centerRef,
    zoomLevelRef,
    scaleXZ,
    fogColor,
    zoomOffset,
    pad,
    texMax,
    renderOrder,
    onFirstVisible,
}: TileRingProps) {
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
        attachMapFogShader(mat, fogUniformsRef.current, String(renderOrder));
        return mat;
    }, []);
    const mapMetaRef = useRef({ cx: 0, cz: 0, w: 1, d: 1 });
    const fetchIdRef = useRef(0);
    /** 가장 최근 fetch를 시작한 key */
    const fetchedKeyRef = useRef("");
    /** useFrame에서 현재 관측된 key */
    const seenKeyRef = useRef("");
    /** seenKey가 처음 관측된 timestamp (ms) */
    const seenKeyAtRef = useRef(0);
    const pendingRef = useRef<PendingTile | null>(null);
    const firstVisibleFiredRef = useRef(false);
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

                // 범위가 바뀐 경우에만 geometry 재생성
                const meta = mapMetaRef.current;
                if (
                    meta.cx !== cx ||
                    meta.cz !== cz ||
                    meta.w !== planeW ||
                    meta.d !== planeD
                ) {
                    mapMetaRef.current = { cx, cz, w: planeW, d: planeD };
                    mesh.position.set(cx, 0, cz);
                    mesh.geometry.dispose();
                    mesh.geometry = new THREE.PlaneGeometry(planeW, planeD);
                }

                const oldTex = mapMaterial.map;
                const tex = new THREE.CanvasTexture(pending.canvas);
                tex.colorSpace = THREE.SRGBColorSpace;
                mapMaterial.map = tex;
                mapMaterial.needsUpdate = true;
                if (oldTex && oldTex !== PLACEHOLDER_TEX) oldTex.dispose();
                updateFogRadius(center);
                mesh.visible = true;
                if (!firstVisibleFiredRef.current) {
                    firstVisibleFiredRef.current = true;
                    onFirstVisible?.();
                }
            }
        }

        updateFogRadius(center);

        const currentZoom = clampEsriZoom(zoomLevelRef.current);
        const zoom = clampEsriZoom(currentZoom + zoomOffset);

        const centerLng = Math.max(-180, Math.min(180, center.x / xF));
        const centerLat = Math.max(-85, Math.min(85, -center.z / zF));

        const b = tileBounds(centerLng, centerLat, zoom, pad);
        const key = `${zoom}:${b.txC}:${b.tyC}`;
        const now = performance.now();

        // 새 key 감지 시 안정화 타이머 리셋
        if (key !== seenKeyRef.current) {
            seenKeyRef.current = key;
            seenKeyAtRef.current = now;
        }

        if (key === fetchedKeyRef.current) return;

        // 줌 변경: 600ms, 중심 이동만: 60ms 안정화 후 fetch
        const prevZoom = fetchedKeyRef.current
            ? Number(fetchedKeyRef.current.split(":")[0])
            : zoom;
        const debounceMs = prevZoom !== zoom ? 600 : 60;
        if (now - seenKeyAtRef.current < debounceMs) return;

        const isZoomChange = prevZoom !== zoom;
        fetchedKeyRef.current = key;
        const myId = ++fetchIdRef.current;
        const bounds = {
            lngMin: b.lngMin,
            lngMax: b.lngMax,
            latMin: b.latMin,
            latMax: b.latMax,
        };

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
            texMax,
            // 줌 변경 시에만 배치 완료마다 preview 업데이트, 이동은 전체 완성 후 교체
            isZoomChange
                ? (progressCanvas) => {
                      if (myId !== fetchIdRef.current) return;
                      pendingRef.current = {
                          canvas: progressCanvas,
                          ...bounds,
                      };
                  }
                : undefined,
        )
            .then((canvas) => {
                if (myId !== fetchIdRef.current) return;
                if (!canvas) {
                    fetchedKeyRef.current = "";
                    return;
                }
                pendingRef.current = { canvas, ...bounds };
            })
            .catch(() => {
                if (myId === fetchIdRef.current) fetchedKeyRef.current = "";
            });
    });

    return (
        <mesh
            ref={meshRef}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={renderOrder}
            visible={false}
        >
            <planeGeometry args={[1, 1]} />
            <primitive object={mapMaterial} attach="material" />
        </mesh>
    );
}

interface Props {
    centerRef: React.RefObject<THREE.Vector3>;
    /** Esri 줌 레벨 2~18 (LiveMapCanvas가 휠 줌에 맞춰 갱신) */
    zoomLevelRef: React.RefObject<number>;
    scaleXZ?: number;
    /** 안개가 섞일 색 (기본: LiveMapCanvas 배경) */
    fogColor?: string;
    /** inner ring(최고 품질)의 첫 타일이 화면에 나타났을 때 호출 */
    onFirstTileReady?: () => void;
    /** 모바일 등 저사양 환경: 타일 수와 해상도를 줄여 성능 확보 */
    lowPower?: boolean;
}

export function TileMapPlane({
    centerRef,
    zoomLevelRef,
    scaleXZ = 1,
    fogColor = "#0a1628",
    onFirstTileReady,
    lowPower = false,
}: Props) {
    const LOD_TIERS = lowPower ? LOD_TIERS_MOBILE : LOD_TIERS_DESKTOP;
    return (
        <>
            {LOD_TIERS.map((tier) => (
                <TileRing
                    key={tier.renderOrder}
                    centerRef={centerRef}
                    zoomLevelRef={zoomLevelRef}
                    scaleXZ={scaleXZ}
                    fogColor={fogColor}
                    zoomOffset={tier.zoomOffset}
                    pad={tier.pad}
                    texMax={tier.texMax}
                    renderOrder={tier.renderOrder}
                    onFirstVisible={
                        tier.renderOrder === 3 ? onFirstTileReady : undefined
                    }
                />
            ))}
        </>
    );
}
