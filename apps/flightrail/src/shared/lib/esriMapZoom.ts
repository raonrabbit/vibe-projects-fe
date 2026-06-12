import * as THREE from "three";

/** Esri World Imagery 타일 줌 (정수). 지도 로직은 이 값만 사용 */
export const MIN_ESRI_ZOOM = 2;
export const MAX_ESRI_ZOOM = 18;

export function clampEsriZoom(z: number): number {
  return Math.round(THREE.MathUtils.clamp(z, MIN_ESRI_ZOOM, MAX_ESRI_ZOOM));
}

/** OrbitControls 거리 → Esri 줌 레벨 (유일한 변환 지점) */
export function esriZoomFromCameraDistance(
  dist: number,
  minDist: number,
  maxDist: number,
  minZoom = MIN_ESRI_ZOOM,
): number {
  const d = THREE.MathUtils.clamp(dist, minDist, maxDist);
  if (maxDist <= minDist) return MAX_ESRI_ZOOM;
  const t = Math.log(d / minDist) / Math.log(maxDist / minDist);
  const z = MAX_ESRI_ZOOM - t * (MAX_ESRI_ZOOM - minZoom);
  return clampEsriZoom(z);
}
