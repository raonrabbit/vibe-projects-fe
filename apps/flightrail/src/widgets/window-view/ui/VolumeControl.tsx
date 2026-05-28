"use client";

import { useEffect, useRef, useState } from "react";

import { LeftTooltip } from "./LeftTooltip";

interface Props {
    volume: number;
    onVolumeChange: (v: number) => void;
}

const BTN_CLS =
    "w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors";

export function VolumeControl({ volume, onVolumeChange }: Props) {
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
        return Math.max(
            0,
            Math.min(1, 1 - (e.clientY - rect.top) / rect.height),
        );
    };

    return (
        <div className="relative group" ref={containerRef}>
            <button
                className={`${BTN_CLS} rounded-t-2xl`}
                onClick={() => setShowVolumeBar((v) => !v)}
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
                        <line
                            x1="2"
                            y1="2"
                            x2="22"
                            y2="22"
                            strokeOpacity="0.4"
                        />
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

            {showVolumeBar && (
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-10 bg-black/60 backdrop-blur-sm rounded-xl py-3 flex flex-col items-center gap-2 select-none">
                    <span className="text-white/50 text-xs tabular-nums w-full text-center">
                        {Math.round(volume * 100)}
                    </span>
                    <div
                        className="w-2 h-20 bg-white/20 rounded-full relative cursor-pointer"
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
                            className="absolute bottom-0 left-0 right-0 bg-white/70 rounded-full"
                            style={{ height: `${volume * 100}%` }}
                        />
                        <div
                            className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow"
                            style={{
                                bottom: `calc(${volume * 100}% - 7px)`,
                            }}
                        />
                    </div>
                </div>
            )}

            <LeftTooltip label="볼륨" />
        </div>
    );
}
