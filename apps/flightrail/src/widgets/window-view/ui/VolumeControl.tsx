"use client";

import { LeftTooltip } from "./LeftTooltip";

interface Props {
  volume: number;
  showVolumeBar: boolean;
  onToggleVolumeBar: () => void;
}

const BTN_CLS =
  "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/10 transition-colors";

export function VolumeControl({
  volume,
  showVolumeBar,
  onToggleVolumeBar,
}: Props) {
  return (
    <div className="group relative">
      <button
        className={`${BTN_CLS} rounded-t-2xl`}
        onClick={onToggleVolumeBar}
      >
        {volume === 0 ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.25"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <line x1="2" y1="2" x2="22" y2="22" strokeOpacity="0.4" />
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
            strokeLinejoin="round"
            strokeOpacity={0.3 + volume * 0.55}
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </button>
      {!showVolumeBar && <LeftTooltip label="볼륨" />}
    </div>
  );
}
