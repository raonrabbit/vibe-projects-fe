"use client";

import { useEffect, useRef, useState } from "react";

import { LeftTooltip } from "./LeftTooltip";
import { VolumeControl } from "./VolumeControl";

const BTN_CLS =
  "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/10 transition-colors";

interface Props {
  showMap: boolean;
  running: boolean;
  volume: number;
  onToggleMap: () => void;
  onToggleRunning: () => void;
  onVolumeChange: (v: number) => void;
}

export function ControlsPill({
  showMap,
  running,
  volume,
  onToggleMap,
  onToggleRunning,
  onVolumeChange,
}: Props) {
  const [showVolumeBar, setShowVolumeBar] = useState(false);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showVolumeBar) return;
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowVolumeBar(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showVolumeBar]);

  const calcVolume = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
  };

  return (
    <div className="flex flex-row items-stretch gap-2" ref={containerRef}>
      {/* Volume bar — stretches to same height as pill */}
      {showVolumeBar && (
        <div className="flex w-10 flex-col items-center gap-2 rounded-2xl border border-white/8 bg-black/20 py-3 backdrop-blur-md select-none md:w-12">
          <span className="w-full text-center text-xs text-white/50 tabular-nums">
            {Math.round(volume * 100)}
          </span>
          <div
            className="relative w-2 flex-1 cursor-pointer rounded-full bg-white/20"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              isDraggingRef.current = true;
              onVolumeChange(calcVolume(e));
            }}
            onPointerMove={(e) => {
              if (!isDraggingRef.current) return;
              onVolumeChange(calcVolume(e));
            }}
            onPointerUp={() => {
              isDraggingRef.current = false;
            }}
          >
            <div
              className="absolute right-0 bottom-0 left-0 rounded-full bg-white/70"
              style={{ height: `${volume * 100}%` }}
            />
            <div
              className="absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-white shadow"
              style={{
                bottom: `calc(${volume * 100}% - 7px)`,
              }}
            />
          </div>
        </div>
      )}

      {/* 3-button pill */}
      <div className="flex flex-col divide-y divide-white/8 rounded-2xl bg-black/20 backdrop-blur-md">
        <VolumeControl
          volume={volume}
          showVolumeBar={showVolumeBar}
          onToggleVolumeBar={() => setShowVolumeBar((v) => !v)}
        />

        {/* Globe / Window toggle */}
        <div className="group relative">
          <button className={BTN_CLS} onClick={onToggleMap}>
            {showMap ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeOpacity="0.65"
              >
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <path d="M3 9h18M9 9v12" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeOpacity="0.65"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            )}
          </button>
          <LeftTooltip label={showMap ? "창문 뷰" : "지도"} />
        </div>

        {/* Pause / Play */}
        <div className="group relative">
          <button
            className={`${BTN_CLS} rounded-b-2xl`}
            onClick={onToggleRunning}
          >
            {running ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                fillOpacity="0.65"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                fillOpacity="0.65"
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>
          <LeftTooltip label={running ? "일시정지" : "재생"} />
        </div>
      </div>
    </div>
  );
}
