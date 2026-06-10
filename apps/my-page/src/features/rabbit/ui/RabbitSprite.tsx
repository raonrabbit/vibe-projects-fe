"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export interface RabbitSpriteProps {
  state: "idle" | "run" | "react";
  direction?: "up" | "down";
  flipX?: boolean;
}

// Palette tokens — resolved per-theme in renderFrame
const W = "#F5F5F0"; // off-white  (skin in dark / eye in light)
const P = "#FFB3C6"; // pink       (always)
const B = "#1A1A1A"; // near-black (eye in dark  / skin in light)
const _ = null;

type Pixel = string | null;
type Frame = Pixel[][];

// 12 cols × 11 rows
const IDLE_FRAMES: Frame[] = [
  // Frame 0 — sitting, ears up
  [
    [_, _, W, W, _, _, _, _, _, _, _, _],
    [_, _, W, P, _, _, _, _, _, _, _, _],
    [_, _, W, W, _, _, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, B, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, _, W, W, _, W, W, _, _, _, _, _],
    [_, _, W, W, _, W, W, _, _, _, _, _],
  ],
  // Frame 1 — ear slightly drooped
  [
    [_, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, W, W, _, _, _, _, _, _, _, _],
    [_, _, W, P, _, _, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, B, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, _, W, W, _, W, W, _, _, _, _, _],
    [_, _, W, W, _, W, W, _, _, _, _, _],
  ],
  // Frame 2 — blink (eye row = all skin → invisible)
  [
    [_, _, W, W, _, _, _, _, _, _, _, _],
    [_, _, W, P, _, _, _, _, _, _, _, _],
    [_, _, W, W, _, _, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, _, W, W, _, W, W, _, _, _, _, _],
    [_, _, W, W, _, W, W, _, _, _, _, _],
  ],
];

// kept for reference (run state currently uses REACT_FRAMES)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RUN_FRAMES: Frame[] = [
  // Frame 0 — one leg forward
  [
    [_, _, W, W, _, _, _, _, _, _, _, _],
    [_, _, W, P, _, _, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, B, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, _, _, W, W, W, _, _, _, _, _, _],
    [_, W, W, _, _, _, _, _, _, _, _, _],
    [_, W, W, _, _, _, _, _, _, _, _, _],
  ],
  // Frame 1 — other leg forward
  [
    [_, _, W, W, _, _, _, _, _, _, _, _],
    [_, _, W, P, _, _, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, B, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, W, W, _, _, _, _, _],
    [_, _, _, _, _, W, W, _, _, _, _, _],
  ],
];

const REACT_FRAMES: Frame[] = [
  // Frame 0 — startled, ears shoot up, wide eyes (two dots)
  [
    [_, W, _, W, _, _, _, _, _, _, _, _],
    [_, W, _, W, _, _, _, _, _, _, _, _],
    [_, W, _, W, _, _, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, B, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, _, W, W, _, W, W, _, _, _, _, _],
    [_, _, W, W, _, W, W, _, _, _, _, _],
  ],
  // Frame 1 — jump, body lifted, legs tucked
  [
    [_, _, W, W, _, _, _, _, _, _, _, _],
    [_, _, W, P, _, _, _, _, _, _, _, _],
    [_, _, W, W, _, _, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, B, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, _, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, W, W, W, _, _, _, _, _],
    [_, W, W, W, _, W, W, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _],
  ],
];

function subscribeDarkMode(cb: () => void) {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const COLS = 12;
const ROWS = 11;
const PX = 3; // each pixel = 3×3 SVG units

function renderFrame(frame: Frame, isDark: boolean) {
  const SKIN = isDark ? W : B;
  const EYE = isDark ? B : W;
  const resolve = (c: string) => (c === W ? SKIN : c === B ? EYE : c);

  const rects: React.ReactElement[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const color = frame[row]?.[col];
      if (!color) continue;
      rects.push(
        <rect
          key={`${row}-${col}`}
          x={col * PX}
          y={row * PX}
          width={PX}
          height={PX}
          fill={resolve(color)}
        />,
      );
    }
  }
  return rects;
}

// Idle sequence: frame indices and corresponding durations (ms)
const IDLE_SEQUENCE = [0, 1, 0, 2] as const;
const IDLE_DURATIONS = [800, 200, 800, 150] as const;

export function RabbitSprite({
  state,
  direction = "down",
  flipX = false,
}: RabbitSpriteProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const isDark = useSyncExternalStore(
    subscribeDarkMode,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (state === "idle") {
      const scheduleNext = (seqIdx: number) => {
        timerRef.current = setTimeout(() => {
          const nextSeqIdx = (seqIdx + 1) % IDLE_SEQUENCE.length;
          setFrameIndex(IDLE_SEQUENCE[nextSeqIdx]);
          scheduleNext(nextSeqIdx);
        }, IDLE_DURATIONS[seqIdx]);
      };

      scheduleNext(0);
    } else if (state === "run") {
      let fi = 0;
      const durations = [200, 160] as const;
      const tick = () => {
        fi = (fi + 1) % REACT_FRAMES.length;
        setFrameIndex(fi);
        timerRef.current = setTimeout(tick, durations[fi as 0 | 1]);
      };
      timerRef.current = setTimeout(tick, durations[0]);
    } else {
      // react
      let fi = 0;
      const durations = [200, 300] as const;
      const tick = () => {
        fi = (fi + 1) % REACT_FRAMES.length;
        setFrameIndex(fi);
        timerRef.current = setTimeout(tick, durations[fi as 0 | 1]);
      };
      timerRef.current = setTimeout(tick, durations[0]);
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state]);

  const frames =
    state === "run"
      ? REACT_FRAMES
      : state === "react"
        ? REACT_FRAMES
        : IDLE_FRAMES;
  const safeIndex = frameIndex % frames.length;
  const frame = frames[safeIndex];

  const viewBoxWidth = COLS * PX;
  const viewBoxHeight = ROWS * PX;

  const transforms: string[] = [];
  if (direction === "up")
    transforms.push(`scale(1,-1) translate(0,-${viewBoxHeight})`);
  if (flipX) transforms.push(`scale(-1,1) translate(-${viewBoxWidth},0)`);
  const groupTransform =
    transforms.length > 0 ? transforms.join(" ") : undefined;

  return (
    <svg
      width={viewBoxWidth}
      height={viewBoxHeight}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      style={{ imageRendering: "pixelated", display: "block" }}
      aria-hidden="true"
    >
      <g transform={groupTransform}>{renderFrame(frame, isDark)}</g>
    </svg>
  );
}
