import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

export const MAP_W = 20;
export const MAP_H = 10;

const WORLD_MAP_TEX_MAX_W = 4096;

/** scaleXZ로 메시를 키울 때 텍스처도 같이 키워 픽셀 깨짐 방지 */
export function worldMapTextureSize(scaleXZ = 1): {
  width: number;
  height: number;
} {
  const pxPerUnit = 88;
  const width = Math.min(
    WORLD_MAP_TEX_MAX_W,
    Math.max(2048, Math.round(MAP_W * scaleXZ * pxPerUnit)),
  );
  return { width, height: Math.round(width / 2) };
}

type WorldTopology = Topology<{
  land: GeometryCollection;
  countries: GeometryCollection;
}>;

export function latLngTo3D(
  lat: number,
  lng: number,
  z = 0.15,
  scale = 1,
): [number, number, number] {
  return [
    (lng / 180) * (MAP_W / 2) * scale,
    (lat / 90) * (MAP_H / 2) * scale,
    z,
  ];
}

/**
 * 지도·항로 좌표 배율 (MAP_W×H 메시, latLng 변환).
 * 1 = 지구 둘레 40,075km를 MAP_W(20)에 매핑한 기준.
 */
export const WORLD_MAP_SCALE = 50;

/** 비행기 시각 크기를 맞춘 기준 지도 배율 — WORLD_MAP_SCALE과 분리 */
export const PLANE_VIS_MAP_SCALE = 5;

/** @deprecated WORLD_MAP_SCALE 사용 */
export const WORLD_SCENE_SCALE = WORLD_MAP_SCALE;

/** @deprecated WORLD_MAP_SCALE 사용 */
export const LIVE_MAP_SCALE = WORLD_MAP_SCALE;

/** MAP_W(20) units ≈ 지구 적도 둘레 40,075 km */
export const KM_PER_MAP_UNIT = 40_075 / MAP_W;

const AIRCRAFT_LENGTH_KM = 0.073;

/**
 * 항로 km·지도 좌표 길이로 비행기 월드 스케일(최대 치수) 계산.
 * mapScale이 커져도 PLANE_VIS_MAP_SCALE 기준 크기 유지.
 */
export function planeWorldScaleForRoute(
  routeKm: number,
  routeMapUnits: number,
  mapScale: number = WORLD_MAP_SCALE,
): number {
  const refUnits = routeMapUnits * (PLANE_VIS_MAP_SCALE / mapScale);
  if (routeKm <= 0 || refUnits <= 0) return 0.08 * PLANE_VIS_MAP_SCALE;
  const geographic = (AIRCRAFT_LENGTH_KM / routeKm) * refUnits;
  const min = refUnits * 0.012;
  const max = refUnits * 0.035;
  return Math.min(Math.max(geographic, min), max);
}

/** Maps lat/lng to a horizontal (floor) XZ plane. Y is height above the floor. */
export function latLngToFloor(
  lat: number,
  lng: number,
  y = 0,
  scale = 1,
): [number, number, number] {
  return [
    (lng / 180) * (MAP_W / 2) * scale,
    y,
    -(lat / 90) * (MAP_H / 2) * scale,
  ];
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export function createWorldMapProjection(
  width: number,
  height: number,
): d3.GeoProjection {
  return d3.geoEquirectangular().fitSize([width, height], {
    type: "Sphere",
  } as d3.GeoPermissibleObjects);
}

/** 투명 배경 위에 국경선만 그림 (Blue Marble 텍스처와 분리해 업스케일 방지) */
export async function drawWorldBorders(
  canvas: HTMLCanvasElement,
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = canvas;
  const projection = createWorldMapProjection(width, height);
  const path = d3.geoPath(projection, ctx);

  const world = await d3.json<WorldTopology>("/countries-110m.json");
  if (!world) return;

  const borders = topojson.mesh(
    world,
    world.objects.countries,
    (a, b) => a !== b,
  );

  ctx.clearRect(0, 0, width, height);
  const lineScale = width / 2048;
  ctx.beginPath();
  path(borders);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 0.9 * lineScale;
  ctx.stroke();
}

/** @deprecated drawWorldBorders + useTexture("/blue-marble.jpg") 조합으로 대체 */
export async function drawWorldMap(canvas: HTMLCanvasElement): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = canvas;
  const projection = createWorldMapProjection(width, height);
  const path = d3.geoPath(projection, ctx);

  const world = await d3.json<WorldTopology>("/countries-110m.json");
  if (!world) return;

  const land = topojson.feature(world, world.objects.land);
  const borders = topojson.mesh(
    world,
    world.objects.countries,
    (a, b) => a !== b,
  );

  ctx.fillStyle = "#0c1a2e";
  ctx.fillRect(0, 0, width, height);

  ctx.beginPath();
  path(land);
  ctx.fillStyle = "#2a4a6e";
  ctx.fill();

  const lineScale = width / 2048;
  ctx.beginPath();
  path(borders);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 0.8 * lineScale;
  ctx.stroke();
}
