"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const MapSceneCanvas = dynamic(() => import("./MapSceneCanvas"), {
  ssr: false,
  loading: () => null,
});

export function MapScene() {
  return (
    <Suspense fallback={null}>
      <MapSceneCanvas />
    </Suspense>
  );
}
