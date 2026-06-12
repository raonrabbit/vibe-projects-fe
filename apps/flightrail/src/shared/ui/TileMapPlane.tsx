"use client";

// Map tiles © Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { clampEsriZoom } from "@/shared/lib/esriMapZoom";
import { MAP_H, MAP_W } from "@/shared/lib/mapUtils";

const FOG_RADIUS_SCALE = 0.68;
const MAX_CACHED_TILES = 512;
const MAX_TILES_PER_RING = 256;

const LOD_TIERS_DESKTOP = [
  { zoomOffset: 0, pad: 7, renderOrder: 3 },
  { zoomOffset: -3, pad: 5, renderOrder: 2 },
  { zoomOffset: -6, pad: 6, renderOrder: 1 },
] as const;

const LOD_TIERS_MOBILE = [
  { zoomOffset: 0, pad: 4, renderOrder: 3 },
  { zoomOffset: -3, pad: 3, renderOrder: 2 },
  { zoomOffset: -6, pad: 4, renderOrder: 1 },
] as const;

const tileUrl = (z: number, y: number, x: number) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;

// ─── LRU Tile Cache (module-level, all rings share one cache) ─────────────

class TileLRUCache {
  private readonly map = new Map<string, THREE.Texture>();

  constructor(private readonly max: number) {}

  get(key: string): THREE.Texture | undefined {
    const val = this.map.get(key);
    if (!val) return undefined;
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  set(key: string, tex: THREE.Texture): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.max) {
      const lruKey = this.map.keys().next().value!;
      this.map.get(lruKey)!.dispose();
      this.map.delete(lruKey);
    }
    this.map.set(key, tex);
  }
}

const tileCache = new TileLRUCache(MAX_CACHED_TILES);
const activeFetches = new Map<string, AbortController>();

async function getTileTexture(
  z: number,
  x: number,
  y: number,
  anisotropy = 1,
): Promise<THREE.Texture | null> {
  const key = `${z}/${x}/${y}`;
  const cached = tileCache.get(key);
  if (cached) return cached;
  if (activeFetches.has(key)) return null;

  const controller = new AbortController();
  activeFetches.set(key, controller);
  try {
    const res = await fetch(tileUrl(z, y, x), {
      signal: controller.signal,
      mode: "cors",
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);
    const tex = await new Promise<THREE.Texture | null>((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(objectURL);
        const t = new THREE.Texture(img);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = anisotropy;
        t.needsUpdate = true;
        resolve(t);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectURL);
        resolve(null);
      };
      img.src = objectURL;
    });
    if (tex) tileCache.set(key, tex);
    return tex;
  } catch {
    return null;
  } finally {
    activeFetches.delete(key);
  }
}

function cancelTileFetch(z: number, x: number, y: number): void {
  const key = `${z}/${x}/${y}`;
  activeFetches.get(key)?.abort();
  activeFetches.delete(key);
}

/** 로딩 중인 타일 위치에 캐시된 저해상도 부모 타일로 즉시 채우기 (Overzoom) */
function findOverzoomTex(
  z: number,
  x: number,
  y: number,
): { tex: THREE.Texture; dz: number } | null {
  for (let dz = 1; dz <= 4; dz++) {
    const pz = z - dz;
    if (pz < 0) break;
    const tex = tileCache.get(`${pz}/${x >> dz}/${y >> dz}`);
    if (tex) return { tex, dz };
  }
  return null;
}

/**
 * PlaneGeometry UV 범위를 설정.
 * PlaneGeometry 꼭짓점 순서 (Three.js 기본): 0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right
 */
function setTileUV(
  geo: THREE.BufferGeometry,
  uMin: number,
  vMin: number,
  uMax: number,
  vMax: number,
): void {
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  uv.setXY(0, uMin, vMax); // top-left
  uv.setXY(1, uMax, vMax); // top-right
  uv.setXY(2, uMin, vMin); // bottom-left
  uv.setXY(3, uMax, vMin); // bottom-right
  uv.needsUpdate = true;
}

/** 부모 타일에서 이 자식 타일에 해당하는 UV 부분 영역을 계산 */
function overzoomUV(
  dz: number,
  x: number,
  y: number,
): [number, number, number, number] {
  const scale = 1 / (1 << dz);
  const colInParent = x & ((1 << dz) - 1);
  const rowInParent = y & ((1 << dz) - 1);
  const uMin = colInParent * scale;
  const uMax = uMin + scale;
  // flipY=true 기준: v=1 이 이미지 top(북쪽), 행 0 = 북쪽
  const vMin = ((1 << dz) - rowInParent - 1) * scale;
  const vMax = vMin + scale;
  return [uMin, vMin, uMax, vMax];
}

// ─── Coordinate helpers ───────────────────────────────────────────────────

function lng2tile(lng: number, z: number) {
  return Math.floor(((lng + 180) / 360) * 2 ** z);
}

function lat2tile(lat: number, z: number) {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z,
  );
}

function tile2lat(ty: number, zoom: number): number {
  const n = Math.PI - (2 * Math.PI * ty) / 2 ** zoom;
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

// ─── Placeholder texture ──────────────────────────────────────────────────

const PLACEHOLDER_TEX = (() => {
  const data = new Uint8Array([28, 42, 62, 255]);
  const tex = new THREE.DataTexture(data, 1, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
})();

// ─── Fog shader (ring당 program 공유) ─────────────────────────────────────

type MapFogUniforms = {
  airplanePos: { value: THREE.Vector3 };
  fadeRadius: { value: number };
  fogColor: { value: THREE.Color };
};

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
  mat.customProgramCacheKey = () => `tile-map-plane-fog-v4-${cacheKeySuffix}`;
}

// ─── TileRing ─────────────────────────────────────────────────────────────

interface TileRingProps {
  centerRef: React.RefObject<THREE.Vector3>;
  zoomLevelRef: React.RefObject<number>;
  headingRef?: React.RefObject<number>;
  scaleXZ: number;
  fogColor: string;
  zoomOffset: number;
  pad: number;
  renderOrder: number;
  onFirstVisible?: () => void;
}

interface ActiveTile {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  hasFinalTex: boolean;
}

function TileRing({
  centerRef,
  zoomLevelRef,
  headingRef,
  scaleXZ,
  fogColor,
  zoomOffset,
  pad,
  renderOrder,
  onFirstVisible,
}: TileRingProps) {
  const { gl } = useThree();
  const anisotropy = gl.capabilities.getMaxAnisotropy();
  const groupRef = useRef<THREE.Group>(null);
  const fogUniformsRef = useRef<MapFogUniforms>({
    airplanePos: { value: new THREE.Vector3() },
    fadeRadius: { value: 40 },
    fogColor: { value: new THREE.Color(fogColor) },
  });
  const activeTilesRef = useRef(new Map<string, ActiveTile>());
  const committedKeyRef = useRef("");
  const seenKeyRef = useRef("");
  const seenKeyAtRef = useRef(0);
  const committedZoomRef = useRef(-1);
  const firstVisibleFiredRef = useRef(false);

  const xF = useMemo(() => ((MAP_W / 2) * scaleXZ) / 180, [scaleXZ]);
  const zF = useMemo(() => ((MAP_H / 2) * scaleXZ) / 90, [scaleXZ]);

  useEffect(() => {
    fogUniformsRef.current.fogColor.value.set(fogColor);
  }, [fogColor]);

  useEffect(() => {
    const group = groupRef.current;
    return () => {
      for (const [key, { mesh, mat }] of activeTilesRef.current) {
        group?.remove(mesh);
        mesh.geometry.dispose();
        mat.dispose();
        const parts = key.split("/");
        cancelTileFetch(Number(parts[0]), Number(parts[1]), Number(parts[2]));
      }
      activeTilesRef.current.clear();
    };
  }, []);

  useFrame(() => {
    const center = centerRef.current;
    const group = groupRef.current;
    if (!center || !group) return;

    // 매 프레임 fog position 갱신
    fogUniformsRef.current.airplanePos.value.copy(center);

    const zoom = clampEsriZoom(
      clampEsriZoom(zoomLevelRef.current) + zoomOffset,
    );
    const n = 2 ** zoom;

    const centerLng = Math.max(-180, Math.min(180, center.x / xF));
    const centerLat = Math.max(-85, Math.min(85, -center.z / zF));

    const txC = lng2tile(centerLng, zoom);
    const tyC = lat2tile(centerLat, zoom);
    // heading이 0.5 초과인 방향으로 1타일 확장해 이동 방향 프리패치
    const heading = headingRef?.current ?? 0;
    const hdx = Math.cos(heading); // +: east(tx증가), -: west(tx감소)
    const hdy = -Math.sin(heading); // +: south(ty증가), -: north(ty감소)
    const txMin = Math.max(txC - pad + (hdx < -0.5 ? -1 : 0), 0);
    const txMax = Math.min(txC + pad + (hdx > 0.5 ? 1 : 0), n - 1);
    const tyMin = Math.max(tyC - pad + (hdy < -0.5 ? -1 : 0), 0);
    const tyMax = Math.min(tyC + pad + (hdy > 0.5 ? 1 : 0), n - 1);
    if ((txMax - txMin + 1) * (tyMax - tyMin + 1) > MAX_TILES_PER_RING) return;

    // Ring 전체 범위로 fog radius 갱신
    const lngMin = (txMin / n) * 360 - 180;
    const lngMax = ((txMax + 1) / n) * 360 - 180;
    const latMin = tile2lat(tyMax + 1, zoom);
    const latMax = tile2lat(tyMin, zoom);
    const totalW = (lngMax - lngMin) * xF;
    const totalD = (latMax - latMin) * zF;
    const totalCx = ((lngMin + lngMax) / 2) * xF;
    const totalCz = -((latMin + latMax) / 2) * zF;
    fogUniformsRef.current.fadeRadius.value =
      Math.hypot(
        Math.abs(center.x - totalCx) + totalW / 2,
        Math.abs(center.z - totalCz) + totalD / 2,
      ) * FOG_RADIUS_SCALE;

    // 중심→외곽 정렬된 타일 목록
    const tiles: Array<{ x: number; y: number }> = [];
    for (let ty = tyMin; ty <= tyMax; ty++) {
      for (let tx = txMin; tx <= txMax; tx++) {
        tiles.push({ x: tx, y: ty });
      }
    }
    tiles.sort(
      (a, b) =>
        Math.hypot(a.x - txC, a.y - tyC) - Math.hypot(b.x - txC, b.y - tyC),
    );

    const targetKeySet = new Set(tiles.map((t) => `${zoom}/${t.x}/${t.y}`));
    const tileSetKey = `${zoom}:${txC}:${tyC}`;

    // 디바운스: 안정화 전까지 새 타일 추가 보류 (기존 타일은 계속 보임)
    const now = performance.now();
    if (tileSetKey !== seenKeyRef.current) {
      seenKeyRef.current = tileSetKey;
      seenKeyAtRef.current = now;
    }
    const debounceMs = committedZoomRef.current !== zoom ? 600 : 60;
    const stable = now - seenKeyAtRef.current >= debounceMs;

    if (stable && tileSetKey !== committedKeyRef.current) {
      // 뷰포트 밖 타일 제거 + fetch 취소
      for (const [key, { mesh, mat }] of activeTilesRef.current) {
        if (!targetKeySet.has(key)) {
          group.remove(mesh);
          mesh.geometry.dispose();
          mat.dispose();
          const parts = key.split("/");
          cancelTileFetch(Number(parts[0]), Number(parts[1]), Number(parts[2]));
          activeTilesRef.current.delete(key);
        }
      }

      committedKeyRef.current = tileSetKey;
      committedZoomRef.current = zoom;

      // 새 타일 추가 (중심→외곽 순)
      for (const { x, y } of tiles) {
        const key = `${zoom}/${x}/${y}`;
        if (activeTilesRef.current.has(key)) continue;

        // 타일 세계 좌표 — 재투영 없이 lat/lng 범위 직접 배치
        const tileLngMin = (x / n) * 360 - 180;
        const tileLngMax = ((x + 1) / n) * 360 - 180;
        const tileLatMin = tile2lat(y + 1, zoom);
        const tileLatMax = tile2lat(y, zoom);
        const tw = (tileLngMax - tileLngMin) * xF;
        const td = (tileLatMax - tileLatMin) * zF;
        const cx = ((tileLngMin + tileLngMax) / 2) * xF;
        const cz = -((tileLatMin + tileLatMax) / 2) * zF;

        const geo = new THREE.PlaneGeometry(1, 1);
        const mat = new THREE.MeshBasicMaterial({
          map: PLACEHOLDER_TEX,
          toneMapped: false,
        });
        attachMapFogShader(mat, fogUniformsRef.current, String(renderOrder));

        // Overzoom: 캐시된 저해상도 부모 타일 즉시 표시 (올바른 UV 부분 영역만)
        const overzoom = findOverzoomTex(zoom, x, y);
        if (overzoom) {
          mat.map = overzoom.tex;
          const [uMin, vMin, uMax, vMax] = overzoomUV(overzoom.dz, x, y);
          setTileUV(geo, uMin, vMin, uMax, vMax);
          mat.needsUpdate = true;
        }

        // ring별 미세 Y 오프셋 — 투명 mesh 간 z-fighting 방지
        const yOffset = renderOrder * 0.0001;
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.scale.set(tw, td, 1);
        mesh.position.set(cx, yOffset, cz);
        mesh.renderOrder = renderOrder;
        group.add(mesh);

        // 캐시 히트: 즉시 고품질 표시
        const cached = tileCache.get(key);
        if (cached) {
          mat.map = cached;
          mat.needsUpdate = true;
          activeTilesRef.current.set(key, {
            mesh,
            mat,
            hasFinalTex: true,
          });
          if (!firstVisibleFiredRef.current) {
            firstVisibleFiredRef.current = true;
            onFirstVisible?.();
          }
          continue;
        }

        activeTilesRef.current.set(key, {
          mesh,
          mat,
          hasFinalTex: false,
        });

        getTileTexture(zoom, x, y, anisotropy).then((tex) => {
          if (!tex) return;
          const active = activeTilesRef.current.get(key);
          if (!active || active.hasFinalTex) return;
          setTileUV(active.mesh.geometry, 0, 0, 1, 1); // overzoom UV 리셋
          active.mat.map = tex;
          active.mat.needsUpdate = true;
          active.hasFinalTex = true;
          if (!firstVisibleFiredRef.current) {
            firstVisibleFiredRef.current = true;
            onFirstVisible?.();
          }
        });
      }
    }
  });

  return <group ref={groupRef} />;
}

// ─── TileMapPlane (interface unchanged) ──────────────────────────────────

interface Props {
  centerRef: React.RefObject<THREE.Vector3>;
  /** Esri 줌 레벨 2~18 (LiveMapCanvas가 휠 줌에 맞춰 갱신) */
  zoomLevelRef: React.RefObject<number>;
  /** Three.js yaw 라디안 — 이동 방향 앞쪽 타일 프리패치에 사용 */
  headingRef?: React.RefObject<number>;
  scaleXZ?: number;
  /** 안개가 섞일 색 (기본: LiveMapCanvas 배경) */
  fogColor?: string;
  /** inner ring(최고 품질)의 첫 타일이 화면에 나타났을 때 호출 */
  onFirstTileReady?: () => void;
  /** 모바일 등 저사양 환경: 타일 수를 줄여 성능 확보 */
  lowPower?: boolean;
}

export function TileMapPlane({
  centerRef,
  zoomLevelRef,
  headingRef,
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
          headingRef={headingRef}
          scaleXZ={scaleXZ}
          fogColor={fogColor}
          zoomOffset={tier.zoomOffset}
          pad={tier.pad}
          renderOrder={tier.renderOrder}
          onFirstVisible={tier.renderOrder === 3 ? onFirstTileReady : undefined}
        />
      ))}
    </>
  );
}
