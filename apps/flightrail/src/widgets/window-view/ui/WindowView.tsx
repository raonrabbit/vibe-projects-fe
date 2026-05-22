"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { CabinLightMode } from "./WindowScene";

const WindowScene = dynamic(() => import("./WindowScene"), { ssr: false });

function formatTime(s: number) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function formatDistance(s: number) {
    const km = Math.round((s / 3600) * 900);
    return `${km.toLocaleString()} km`;
}

const CABIN_MODES: CabinLightMode[] = ["auto", "on", "off"];

export default function WindowView() {
    const [hour] = useState(9);
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(true);
    const [cabinMode, setCabinMode] = useState<CabinLightMode>("auto");

    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => setElapsed((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, [running]);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#0a0806]">
            {/* 3D sky canvas */}
            <div className="absolute inset-0">
                <WindowScene hour={hour} cabinMode={cabinMode} />
            </div>

            {/* Top stats */}
            <div className="absolute top-0 left-0 right-0 flex justify-between px-8 pt-8 z-10">
                <div>
                    <p className="text-5xl font-bold text-white tabular-nums tracking-tight leading-none">
                        {formatTime(elapsed)}
                    </p>
                    <p className="text-sm text-white/40 mt-2 tracking-wide">
                        도착까지 시간
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-5xl font-bold text-white tabular-nums tracking-tight leading-none">
                        {formatDistance(elapsed)}
                    </p>
                    <p className="text-sm text-white/40 mt-2 tracking-wide">
                        도착까지 거리
                    </p>
                </div>
            </div>

            {/* Right action buttons */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
                {/* Music */}
                <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center">
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                    </svg>
                </button>
                {/* Globe */}
                <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center">
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                </button>
                {/* Pause / Play */}
                <button
                    onClick={() => setRunning((r) => !r)}
                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center"
                >
                    {running ? (
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="white"
                        >
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                    ) : (
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="white"
                        >
                            <polygon points="5,3 19,12 5,21" />
                        </svg>
                    )}
                </button>
                {/* Cabin light */}
                <div className="flex flex-col rounded-2xl bg-white/10 overflow-hidden">
                    {CABIN_MODES.map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setCabinMode(mode)}
                            className={`w-14 py-2.5 text-[11px] font-semibold tracking-widest uppercase transition-colors ${
                                cabinMode === mode
                                    ? "bg-white/25 text-white"
                                    : "text-white/35 hover:text-white/60"
                            }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
