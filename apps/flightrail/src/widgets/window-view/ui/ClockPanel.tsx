"use client";

import { useState } from "react";

import { skyClockDisplay } from "../model/flightUtils";
import { AnalogClock } from "./AnalogClock";
import TimeBar from "./TimeBar";

interface Props {
  displayHour: number;
  isFixed: boolean;
  isAdjusted: boolean;
  modeLabel: string;
  onToggleFixed: () => void;
  onResetToLocal: () => void;
  onDrag: (hour: number) => void;
}

export function ClockPanel({
  displayHour,
  isFixed,
  isAdjusted,
  modeLabel,
  onToggleFixed,
  onResetToLocal,
  onDrag,
}: Props) {
  const [clockOpen, setClockOpen] = useState(false);

  return (
    <div className="flex items-stretch gap-3">
      {/* Clock button */}
      <button
        className="group flex flex-col items-center gap-0.5 md:flex-row md:items-center md:gap-3"
        onClick={() => setClockOpen((o) => !o)}
      >
        <div className="relative">
          <span className="md:hidden">
            <AnalogClock hour={displayHour} size={36} />
          </span>
          <span className="hidden md:inline">
            <AnalogClock hour={displayHour} size={56} />
          </span>
          <div className="absolute inset-0 rounded-full ring-1 ring-white/0 transition-all duration-200 ring-inset group-hover:ring-white/25" />
        </div>

        {/* Mobile: digital time below clock */}
        <p className="text-sm leading-none font-bold tracking-tight text-white tabular-nums md:hidden">
          {skyClockDisplay(displayHour)}
        </p>

        {/* Desktop: digital time + mode label + arrow */}
        <div className="hidden text-left md:block">
          <p className="text-2xl leading-none font-bold tracking-tight text-white tabular-nums">
            {skyClockDisplay(displayHour)}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[10px] tracking-widest text-white/35 uppercase">
            {modeLabel}
            <svg
              width="5"
              height="8"
              viewBox="0 0 5 8"
              className={`transition-transform duration-200 ${clockOpen ? "rotate-180" : ""}`}
            >
              <path
                d="M0.5 0.5L4.5 4L0.5 7.5"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </p>
        </div>
      </button>

      {/* TimeBar — always rendered to hold height; visibility:hidden when closed */}
      <div className={clockOpen ? "" : "pointer-events-none invisible"}>
        <TimeBar
          indicatorHour={displayHour}
          isFixed={isFixed}
          isAdjusted={isAdjusted}
          onDrag={onDrag}
          onToggleFixed={onToggleFixed}
          onResetToLocal={onResetToLocal}
        />
      </div>
    </div>
  );
}
