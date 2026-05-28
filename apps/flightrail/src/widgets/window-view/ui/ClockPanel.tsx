"use client";

import { useState } from "react";

import { skyClockDisplay } from "../model/flightUtils";
import { AnalogClock } from "./AnalogClock";
import TimeBar, { type TimeMode } from "./TimeBar";

interface Props {
    displayHour: number;
    timeMode: TimeMode;
    modeLabel: string;
    onModeChange: (m: TimeMode) => void;
    onDrag: (hour: number) => void;
}

export function ClockPanel({
    displayHour,
    timeMode,
    modeLabel,
    onModeChange,
    onDrag,
}: Props) {
    const [clockOpen, setClockOpen] = useState(false);

    return (
        <div>
            <button
                className="flex items-center gap-3 group"
                onClick={() => setClockOpen((o) => !o)}
            >
                <div className="relative">
                    <AnalogClock hour={displayHour} />
                    <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/0 group-hover:ring-white/25 transition-all duration-200" />
                </div>
                <div className="text-left">
                    <p className="text-2xl font-bold text-white tabular-nums tracking-tight leading-none">
                        {skyClockDisplay(displayHour)}
                    </p>
                    <p className="text-[10px] text-white/35 mt-1 tracking-widest uppercase flex items-center gap-1">
                        {modeLabel}
                        <svg
                            width="8"
                            height="5"
                            viewBox="0 0 8 5"
                            className={`transition-transform duration-200 ${clockOpen ? "rotate-180" : ""}`}
                        >
                            <path
                                d="M0.5 0.5L4 4L7.5 0.5"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </svg>
                    </p>
                </div>
            </button>

            <div
                className={`mt-3 transition-all duration-200 origin-top ${
                    clockOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-1 pointer-events-none"
                }`}
            >
                <TimeBar
                    indicatorHour={displayHour}
                    mode={timeMode}
                    onDrag={onDrag}
                    onModeChange={onModeChange}
                />
            </div>
        </div>
    );
}
