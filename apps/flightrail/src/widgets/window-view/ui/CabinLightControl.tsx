"use client";

import { useState } from "react";

import { LeftTooltip } from "./LeftTooltip";
import type { CabinLightMode } from "./WindowScene";

interface Props {
  cabinMode: CabinLightMode;
  onCabinModeChange: (m: CabinLightMode) => void;
}

const BTN_CLS =
  "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/10 transition-colors";

export function CabinLightControl({ cabinMode, onCabinModeChange }: Props) {
  const [cabinOpen, setCabinOpen] = useState(false);

  const select = (m: CabinLightMode) => {
    onCabinModeChange(m);
    setCabinOpen(false);
  };

  return (
    <div className="group relative">
      <button
        className={`${BTN_CLS} rounded-full bg-black/20 backdrop-blur-md`}
        onClick={() => setCabinOpen((o) => !o)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={
            cabinMode === "on"
              ? "var(--color-fr-amber)"
              : cabinMode === "auto"
                ? "var(--color-fr-sky-hi)"
                : "white"
          }
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={cabinMode === "off" ? 0.3 : 0.85}
        >
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>
      </button>

      {!cabinOpen && (
        <LeftTooltip
          label={
            cabinMode === "on"
              ? "캐빈 조명: 켜짐"
              : cabinMode === "auto"
                ? "캐빈 조명: 자동"
                : "캐빈 조명: 꺼짐"
          }
        />
      )}

      <div
        className={`absolute top-full right-0 mt-2 flex flex-col gap-2 transition-all duration-200 ease-out ${
          cabinOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          onClick={() => select("on")}
          className={`${BTN_CLS} flex-col gap-0.5 rounded-full transition-all ${
            cabinMode === "on"
              ? "bg-amber-400/25 text-amber-300 ring-1 ring-amber-400/50"
              : "bg-white/8 text-white/30 hover:bg-white/12 hover:text-white/55"
          }`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <span className="text-[8px] font-bold tracking-wider">ON</span>
        </button>

        <button
          onClick={() => select("auto")}
          className={`${BTN_CLS} flex-col gap-0.5 rounded-full transition-all ${
            cabinMode === "auto"
              ? "bg-sky-400/20 text-sky-200 ring-1 ring-sky-400/40"
              : "bg-white/8 text-white/30 hover:bg-white/12 hover:text-white/55"
          }`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <span className="text-[8px] font-bold tracking-wider">AUTO</span>
        </button>

        <button
          onClick={() => select("off")}
          className={`${BTN_CLS} flex-col gap-0.5 rounded-full transition-all ${
            cabinMode === "off"
              ? "bg-white/12 text-white/55 ring-1 ring-white/20"
              : "bg-white/8 text-white/30 hover:bg-white/12 hover:text-white/55"
          }`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
          <span className="text-[8px] font-bold tracking-wider">OFF</span>
        </button>
      </div>
    </div>
  );
}
