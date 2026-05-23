"use client";

import { useCallback, useRef } from "react";

export type TimeMode = "local" | "from" | "fixed";

interface TimeBarProps {
    indicatorHour: number;
    mode: TimeMode;
    onDrag: (hour: number) => void;
    onModeChange: (m: TimeMode) => void;
}

const MODE_LABELS: Record<TimeMode, string> = {
    local: "현재",
    from: "출발",
    fixed: "고정",
};

const MODE_TOOLTIPS: Record<TimeMode, string> = {
    local: "현재 로컬 시각 기준",
    from: "선택한 시각부터 흘러가기",
    fixed: "선택한 시각에 고정",
};

const MODES: TimeMode[] = ["local", "from", "fixed"];

export default function TimeBar({
    indicatorHour,
    mode,
    onDrag,
    onModeChange,
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
            if (mode === "local") onModeChange("from");
            onDrag(hourFromX(e.clientX));
        },
        [mode, hourFromX, onDrag, onModeChange],
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
        <div className="flex flex-col items-center gap-2">
            {/* Mode toggle */}
            <div className="flex gap-0.5 bg-black/25 backdrop-blur-sm rounded-full px-1 py-1">
                {MODES.map((m) => (
                    <div key={m} className="relative group">
                        <button
                            onClick={() => onModeChange(m)}
                            className={`px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wider transition-colors ${
                                mode === m
                                    ? "bg-white/20 text-white"
                                    : "text-white/35 hover:text-white/60"
                            }`}
                        >
                            {MODE_LABELS[m]}
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {MODE_TOOLTIPS[m]}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tick bar */}
            <div
                ref={barRef}
                className={`relative select-none touch-none ${
                    mode === "local" ? "cursor-pointer" : "cursor-ew-resize"
                }`}
                style={{ width: 288, height: 32 }}
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

                {/* Hour labels at 0, 6, 12, 18 */}
                <div className="absolute bottom-0 left-0 right-0">
                    {([0, 6, 12, 18] as const).map((h) => (
                        <span
                            key={h}
                            className="absolute text-[9px] text-white/30 tabular-nums -translate-x-1/2"
                            style={{ left: `${(h / 24) * 100}%` }}
                        >
                            {String(h).padStart(2, "0")}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
