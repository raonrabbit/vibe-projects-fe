"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/cn";

const t = true,
  f = false;

// 12 cols × 11 rows — IDLE_FRAMES[0] 실루엣 (RabbitSprite와 동일 그리드)
const SHAPE: boolean[][] = [
  [f, f, t, t, f, f, f, f, f, f, f, f],
  [f, f, t, t, f, f, f, f, f, f, f, f],
  [f, f, t, t, f, f, f, f, f, f, f, f],
  [f, t, t, t, t, t, f, f, f, f, f, f],
  [f, t, t, t, t, t, f, f, f, f, f, f],
  [f, t, t, t, t, t, f, f, f, f, f, f],
  [f, t, t, t, t, t, t, f, f, f, f, f],
  [f, t, t, t, t, t, t, f, f, f, f, f],
  [f, t, t, t, t, t, t, f, f, f, f, f],
  [f, f, t, t, f, t, t, f, f, f, f, f],
  [f, f, t, t, f, t, t, f, f, f, f, f],
];

const COLS = 12;
const ROWS = 11;
const PX = 3;

function RabbitGhost() {
  return (
    <svg
      width={COLS * PX}
      height={ROWS * PX}
      viewBox={`0 0 ${COLS * PX} ${ROWS * PX}`}
      style={{ imageRendering: "pixelated", display: "block" }}
      aria-hidden="true"
    >
      {Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => {
          if (!SHAPE[r][c]) return null;
          const isOutline = [
            SHAPE[r - 1]?.[c],
            SHAPE[r + 1]?.[c],
            SHAPE[r]?.[c - 1],
            SHAPE[r]?.[c + 1],
          ].some((v) => !v);
          if (!isOutline) return null;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * PX + 0.75}
              y={r * PX + 0.75}
              width={1.5}
              height={1.5}
              fill="currentColor"
            />
          );
        }),
      )}
    </svg>
  );
}

export function RabbitNest() {
  const [phase, setPhase] = useState("nest");

  useEffect(() => {
    const handler = (e: Event) =>
      setPhase((e as CustomEvent<{ phase: string }>).detail.phase);
    window.addEventListener("rabbit:phase", handler);
    return () => window.removeEventListener("rabbit:phase", handler);
  }, []);

  const canRecall =
    phase === "wandering" || phase === "hopping" || phase === "scrolling";
  const isHome = phase === "nest";

  return (
    <button
      id="rabbit-nest"
      onClick={
        canRecall
          ? () => window.dispatchEvent(new CustomEvent("rabbit:recall"))
          : undefined
      }
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
        isHome
          ? "pointer-events-none opacity-0"
          : "opacity-40 hover:opacity-80",
        canRecall ? "cursor-pointer" : "cursor-default",
      )}
      aria-label={canRecall ? "토끼 불러오기" : undefined}
    >
      <RabbitGhost />
    </button>
  );
}
