"use client";

import { Sky, Stars } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  type ComponentProps,
  type ReactNode,
  useLayoutEffect,
  useRef,
} from "react";
import * as THREE from "three";

import { getBlend, getSunPosition } from "@/shared/lib/sky-time";

import {
  AMBIENT_INTENSITY,
  FOG_COLORS,
  HEMI_LIGHT,
  lerpColor,
  lerpN,
  NIGHT_FACTOR,
  SKY_PARAMS,
} from "./sky-constants";

function LayeredSky(props: ComponentProps<typeof Sky>) {
  const root = useRef<THREE.Group>(null!);
  useLayoutEffect(() => {
    root.current.traverse((obj) => {
      obj.renderOrder = -2;
    });
  }, []);
  return (
    <group ref={root}>
      <Sky {...props} />
    </group>
  );
}

/** 카메라를 따라가는 Sky 구 — 지도 좌표가 원점에서 멀 때 필수 */
function SkyFollowCamera({ children }: { children: ReactNode }) {
  const root = useRef<THREE.Group>(null!);
  const { camera } = useThree();
  useFrame(() => {
    root.current.position.copy(camera.position);
  });
  return <group ref={root}>{children}</group>;
}

export interface FlightSkyProps {
  hour: number;
  /** drei Sky 구 반경. 창문 뷰 기본 450 */
  skyDistance?: number;
  /** true면 Sky·별을 카메라 위치에 고정 (라이브 지도) */
  centerOnCamera?: boolean;
}

/** WindowScene과 동일한 Sky·fog·조명 (창문/구름 레이어 제외) */
export function FlightSky({
  hour,
  skyDistance = 450,
  centerOnCamera = false,
}: FlightSkyProps) {
  const sunPosition = getSunPosition(hour);
  const { from, to, t } = getBlend(hour);

  const fogColor = lerpColor(FOG_COLORS[from], FOG_COLORS[to], t);
  const baseTurbidity = lerpN(
    SKY_PARAMS[from].turbidity,
    SKY_PARAMS[to].turbidity,
    t,
  );
  const skyParams = {
    // 큰 Sky 구(라이브 지도)에서는 태양 디스크가 과노출되기 쉬워 대기를 더 탁하게
    turbidity: centerOnCamera ? Math.max(baseTurbidity + 4, 6) : baseTurbidity,
    rayleigh: lerpN(SKY_PARAMS[from].rayleigh, SKY_PARAMS[to].rayleigh, t),
    mieCoefficient: lerpN(
      SKY_PARAMS[from].mieCoefficient,
      SKY_PARAMS[to].mieCoefficient,
      t,
    ),
    mieDirectionalG: lerpN(
      SKY_PARAMS[from].mieDirectionalG,
      SKY_PARAMS[to].mieDirectionalG,
      t,
    ),
  };
  const hemi = {
    sky: lerpColor(HEMI_LIGHT[from].sky, HEMI_LIGHT[to].sky, t),
    ground: lerpColor(HEMI_LIGHT[from].ground, HEMI_LIGHT[to].ground, t),
    intensity: lerpN(HEMI_LIGHT[from].intensity, HEMI_LIGHT[to].intensity, t),
  };
  const ambientIntensity = lerpN(
    AMBIENT_INTENSITY[from],
    AMBIENT_INTENSITY[to],
    t,
  );
  const nightFactor = lerpN(NIGHT_FACTOR[from], NIGHT_FACTOR[to], t);

  const fogNear = centerOnCamera ? skyDistance * 0.12 : 300;
  const fogFar = centerOnCamera ? skyDistance * 0.92 : 1200;

  const skyBody = (
    <>
      <LayeredSky
        sunPosition={sunPosition}
        {...skyParams}
        distance={skyDistance}
      />
      {nightFactor > 0.1 && (
        <group position={[0, skyDistance * 0.4, 0]}>
          <Stars
            radius={Math.min(100, skyDistance * 0.22)}
            depth={30}
            count={3000}
            factor={4}
            fade
          />
        </group>
      )}
    </>
  );

  return (
    <>
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
      {centerOnCamera ? <SkyFollowCamera>{skyBody}</SkyFollowCamera> : skyBody}
      <ambientLight intensity={ambientIntensity} />
      <hemisphereLight args={[hemi.sky, hemi.ground, hemi.intensity]} />
      <directionalLight
        position={sunPosition}
        color="#fff8ee"
        intensity={centerOnCamera ? 0.85 : 1}
      />
    </>
  );
}
