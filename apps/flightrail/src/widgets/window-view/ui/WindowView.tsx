"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import BoardingTicket from "@/shared/ui/BoardingTicket";

import TimeBar, { type TimeMode } from "./TimeBar";
import type { CabinLightMode } from "./WindowScene";

const WindowScene = dynamic(() => import("./WindowScene"), { ssr: false });

function getLocalHour() {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
}

function formatElapsed(s: number) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function formatDistance(s: number) {
    const km = Math.round((s / 3600) * 900);
    return `${km.toLocaleString()} km`;
}

function skyClockDisplay(hour: number) {
    const n = ((hour % 24) + 24) % 24;
    const h = Math.floor(n);
    const m = Math.floor((n % 1) * 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ─── Analog clock ─────────────────────────────────────────────────
function AnalogClock({ hour }: { hour: number }) {
    const n = ((hour % 24) + 24) % 24;
    const h12 = n % 12;
    const mins = (n % 1) * 60;
    const hourDeg = (h12 / 12) * 360 + (mins / 60) * 30;
    const minDeg = (mins / 60) * 360;

    const px = (len: number, deg: number) =>
        28 + len * Math.sin((deg * Math.PI) / 180);
    const py = (len: number, deg: number) =>
        28 - len * Math.cos((deg * Math.PI) / 180);

    return (
        <svg width="56" height="56" viewBox="0 0 56 56">
            <circle
                cx="28"
                cy="28"
                r="26"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                fill="rgba(0,0,0,0.15)"
            />
            {[0, 90, 180, 270].map((deg) => (
                <line
                    key={deg}
                    x1={px(20, deg)}
                    y1={py(20, deg)}
                    x2={px(23, deg)}
                    y2={py(23, deg)}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            ))}
            {/* Hour hand */}
            <line
                x1="28"
                y1="28"
                x2={px(14, hourDeg)}
                y2={py(14, hourDeg)}
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeOpacity="0.9"
            />
            {/* Minute hand */}
            <line
                x1="28"
                y1="28"
                x2={px(21, minDeg)}
                y2={py(21, minDeg)}
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeOpacity="0.6"
            />
            <circle cx="28" cy="28" r="2.5" fill="white" fillOpacity="0.9" />
        </svg>
    );
}

// ─── Left-side tooltip ────────────────────────────────────────────
function LeftTooltip({ label }: { label: string }) {
    return (
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {label}
        </div>
    );
}

const CABIN_MODES: CabinLightMode[] = ["auto", "on", "off"];

export default function WindowView() {
    const [ready, setReady] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(true);
    const [cabinMode, setCabinMode] = useState<CabinLightMode>("auto");
    const [cabinOpen, setCabinOpen] = useState(false);
    const [clockOpen, setClockOpen] = useState(false);

    const [timeMode, setTimeMode] = useState<TimeMode>("local");
    const [fromOffset, setFromOffset] = useState(0);
    const [fixedHour, setFixedHour] = useState(0);
    const [localHour, setLocalHour] = useState(getLocalHour);

    useEffect(() => {
        const id = setInterval(() => setLocalHour(getLocalHour()), 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => setElapsed((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, [running]);

    const displayHour =
        timeMode === "local"
            ? localHour
            : timeMode === "from"
              ? (((fromOffset + elapsed / 3600) % 24) + 24) % 24
              : fixedHour;

    const handleModeChange = useCallback(
        (m: TimeMode) => {
            if (m === "from" && timeMode !== "from") {
                const cur = timeMode === "local" ? localHour : fixedHour;
                setFromOffset(cur - elapsed / 3600);
            } else if (m === "fixed" && timeMode !== "fixed") {
                const cur =
                    timeMode === "local"
                        ? localHour
                        : (((fromOffset + elapsed / 3600) % 24) + 24) % 24;
                setFixedHour(Math.floor(((cur % 24) + 24) % 24));
            }
            setTimeMode(m);
        },
        [timeMode, localHour, fixedHour, fromOffset, elapsed],
    );

    const handleBarDrag = useCallback(
        (hour: number) => {
            const effectiveMode = timeMode === "local" ? "from" : timeMode;
            if (effectiveMode === "from") {
                setFromOffset(hour - elapsed / 3600);
            } else {
                setFixedHour(hour);
            }
        },
        [timeMode, elapsed],
    );

    const modeLabel =
        timeMode === "local"
            ? "현재 시각"
            : timeMode === "from"
              ? "출발 기준"
              : "고정 시각";

    const btnCls =
        "w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors";

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#0a0806]">
            {/* 3D sky canvas */}
            <div className="absolute inset-0">
                <WindowScene
                    hour={displayHour}
                    cabinMode={cabinMode}
                    onReady={() => setReady(true)}
                />
            </div>

            {/* Boarding ticket loading overlay */}
            <BoardingTicket ready={ready} />

            {/* Top-left: clock (click to open time controls) */}
            <div className="absolute top-8 left-8 z-10">
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

                {/* Collapsible time bar */}
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
                        onDrag={handleBarDrag}
                        onModeChange={handleModeChange}
                    />
                </div>
            </div>

            {/* Top-right: study stats */}
            <div className="absolute top-8 right-8 z-10">
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/8 text-right">
                    <p className="text-2xl font-bold text-white tabular-nums tracking-tight leading-none">
                        {formatElapsed(elapsed)}
                    </p>
                    <p className="text-[10px] text-white/35 mt-0.5 tracking-widest uppercase">
                        비행 시간
                    </p>
                    <div className="h-px bg-white/8 my-2" />
                    <p className="text-lg font-semibold text-white/70 tabular-nums tracking-tight leading-none">
                        {formatDistance(elapsed)}
                    </p>
                    <p className="text-[10px] text-white/35 mt-0.5 tracking-widest uppercase">
                        비행 거리
                    </p>
                </div>
            </div>

            {/* Right: controls pill */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10">
                <div className="bg-black/20 backdrop-blur-md rounded-2xl flex flex-col divide-y divide-white/8">
                    {/* Music */}
                    <div className="relative group">
                        <button className={`${btnCls} rounded-t-2xl`}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeOpacity="0.65"
                            >
                                <path d="M9 18V5l12-2v13" />
                                <circle cx="6" cy="18" r="3" />
                                <circle cx="18" cy="16" r="3" />
                            </svg>
                        </button>
                        <LeftTooltip label="음악" />
                    </div>
                    {/* Globe */}
                    <div className="relative group">
                        <button className={btnCls}>
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
                        </button>
                        <LeftTooltip label="지도" />
                    </div>
                    {/* Pause / Play */}
                    <div className="relative group">
                        <button
                            className={btnCls}
                            onClick={() => setRunning((r) => !r)}
                        >
                            {running ? (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                    fillOpacity="0.65"
                                >
                                    <rect
                                        x="6"
                                        y="4"
                                        width="4"
                                        height="16"
                                        rx="1"
                                    />
                                    <rect
                                        x="14"
                                        y="4"
                                        width="4"
                                        height="16"
                                        rx="1"
                                    />
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
                    {/* Cabin light */}
                    <div className="relative group">
                        <button
                            className={`${btnCls} rounded-b-2xl`}
                            onClick={() => setCabinOpen((o) => !o)}
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeOpacity="0.65"
                            >
                                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                                <path d="M9 18h6" />
                                <path d="M10 22h4" />
                            </svg>
                        </button>
                        {!cabinOpen && <LeftTooltip label="캐빈 조명" />}
                        <div
                            className={`absolute right-full top-1/2 -translate-y-1/2 mr-3 flex flex-row gap-2 transition-all duration-200 ease-out ${
                                cabinOpen
                                    ? "translate-x-0 opacity-100"
                                    : "translate-x-4 opacity-0 pointer-events-none"
                            }`}
                        >
                            {CABIN_MODES.map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => {
                                        setCabinMode(mode);
                                        setCabinOpen(false);
                                    }}
                                    className={`w-12 h-12 rounded-full text-[11px] font-semibold tracking-widest uppercase transition-colors ${
                                        cabinMode === mode
                                            ? "bg-white/25 text-white"
                                            : "bg-white/10 text-white/50 hover:text-white/80 hover:bg-white/15"
                                    }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
