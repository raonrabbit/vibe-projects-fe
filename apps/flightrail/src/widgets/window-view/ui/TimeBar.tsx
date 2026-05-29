"use client";

import { useCallback, useRef } from "react";

interface TimeBarProps {
    indicatorHour: number;
    isFixed: boolean;
    isAdjusted: boolean;
    onDrag: (hour: number) => void;
    onToggleFixed: () => void;
    onResetToLocal: () => void;
}

export default function TimeBar({
    indicatorHour,
    isFixed,
    isAdjusted,
    onDrag,
    onToggleFixed,
    onResetToLocal,
}: TimeBarProps) {
    const barRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);

    const hourFromX = useCallback((clientX: number) => {
        if (!barRef.current) return 0;
        const rect = barRef.current.getBoundingClientRect();
        const ratio = Math.max(
            0,
            Math.min(1 - 1e-9, (clientX - rect.left) / rect.width),
        );
        return Math.floor(ratio * 24);
    }, []);

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            dragging.current = true;
            (e.currentTarget as Element).setPointerCapture(e.pointerId);
            onDrag(hourFromX(e.clientX));
        },
        [hourFromX, onDrag],
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!dragging.current) return;
            onDrag(hourFromX(e.clientX));
        },
        [hourFromX, onDrag],
    );

    const handlePointerUp = useCallback(() => {
        dragging.current = false;
    }, []);

    const activeIdx = Math.floor(((indicatorHour % 24) + 24) % 24);

    return (
        <div className="flex items-center gap-2 h-full bg-black/25 backdrop-blur-sm rounded-2xl px-2.5 py-2 w-[clamp(160px,calc(100vw-12rem),260px)]">
            {/* Left controls */}
            <div className="flex flex-col gap-0.5 shrink-0">
                {/* 현재로 — action: snap back to real local time */}
                <button
                    onClick={onResetToLocal}
                    title="현재 시각으로"
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold tracking-wider transition-all ${
                        isAdjusted
                            ? "text-white/70 hover:text-white hover:bg-white/10"
                            : "text-white/20 pointer-events-none"
                    }`}
                >
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                    </svg>
                    현재
                </button>

                {/* 고정 — toggle: freeze at current displayed hour */}
                <button
                    onClick={onToggleFixed}
                    title={isFixed ? "고정 해제" : "시각 고정"}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold tracking-wider transition-all ${
                        isFixed
                            ? "bg-white/20 text-white"
                            : "text-white/30 hover:text-white/60 hover:bg-white/8"
                    }`}
                >
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    고정
                </button>
            </div>

            {/* Divider */}
            <div className="w-px self-stretch bg-white/10 shrink-0" />

            {/* Tick bar — fills remaining space */}
            <div
                ref={barRef}
                className="relative select-none touch-none cursor-ew-resize flex-1 min-w-0"
                style={{ height: 32 }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                {/* Ticks */}
                <div className="absolute top-0 left-0 right-0 flex items-start h-6">
                    {Array.from({ length: 24 }, (_, i) => {
                        const isActive = i === activeIdx;
                        const is6h = i % 6 === 0;
                        return (
                            <div key={i} className="flex-1 flex justify-center">
                                <div
                                    className={`w-px transition-all duration-150 ${
                                        isActive
                                            ? "h-6 bg-white"
                                            : is6h
                                              ? "h-4 bg-white/50"
                                              : "h-3 bg-white/25"
                                    }`}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Hour labels — centered on each tick */}
                <div className="absolute bottom-0 left-0 right-0">
                    {([0, 6, 12, 18] as const).map((h) => (
                        <span
                            key={h}
                            className="absolute text-[9px] text-white/30 tabular-nums -translate-x-1/2"
                            style={{ left: `${((h + 0.5) / 24) * 100}%` }}
                        >
                            {String(h).padStart(2, "0")}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
