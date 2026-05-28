"use client";

import { useEffect, useState } from "react";

import { getAirport } from "@/entities/airport";

const BARCODE = [
    1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1,
    0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1,
    0, 0, 1, 0, 1, 1, 0, 1, 0, 0,
];

function formatDuration(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

interface BoardingTicketProps {
    ready: boolean;
    from?: string;
    subject?: string;
    plannedDuration?: number;
}

export default function BoardingTicket({
    ready,
    from = "ICN",
    subject,
    plannedDuration,
}: BoardingTicketProps) {
    const [progress, setProgress] = useState(0);
    const [mounted, setMounted] = useState(true);

    const fromAirport = getAirport(from);
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    useEffect(() => {
        let p = 0;
        const id = setInterval(() => {
            p = Math.min(p + 1.1, 82);
            setProgress(p);
            if (p >= 82) clearInterval(id);
        }, 25);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (!ready) return;
        setProgress(100);
        const timer = setTimeout(() => setMounted(false), 800);
        return () => clearTimeout(timer);
    }, [ready]);

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0a0806] transition-opacity duration-700 ${
                ready ? "opacity-0" : "opacity-100"
            }`}
        >
            <div className="flex h-[190px] w-[680px] overflow-hidden rounded-2xl shadow-2xl shadow-black/60 select-none">
                {/* Main section */}
                <div className="flex-1 bg-[#f5f0e8] px-7 py-5 flex flex-col justify-between">
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#1a1410"
                                strokeWidth="2"
                                strokeLinecap="round"
                            >
                                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                            </svg>
                            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#1a1410]">
                                Flightrail
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] tracking-[0.2em] uppercase text-[#9a9080]">
                                Boarding Pass
                            </p>
                            <p className="text-[9px] text-[#b0a898] mt-0.5">
                                {dateStr}
                            </p>
                        </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-[42px] font-bold text-[#1a1410] tracking-tight leading-none">
                                {from}
                            </p>
                            <p className="text-[10px] text-[#9a9080] mt-1 leading-none">
                                {fromAirport?.name ?? from}
                            </p>
                            {subject && (
                                <p className="text-[9px] text-[#2a6eb0] mt-1.5 tracking-wide">
                                    {subject}
                                </p>
                            )}
                        </div>
                        <div className="flex-1 flex items-center gap-2 pb-4">
                            <div className="flex-1 border-t border-dashed border-[#cdc5b5]" />
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="#9a9080"
                            >
                                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                            </svg>
                            <div className="flex-1 border-t border-dashed border-[#cdc5b5]" />
                        </div>
                        <div className="text-right">
                            <p className="text-[42px] font-bold text-[#c0b8a8] tracking-tight leading-none">
                                ???
                            </p>
                            <p className="text-[10px] text-[#b0a898] mt-1">
                                Calculating...
                            </p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div>
                        <div className="h-1.5 bg-[#e4ddd0] rounded-full overflow-hidden mb-1.5">
                            <div
                                className="h-full bg-[#2a6eb0] rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[9px] text-[#9a9080] tracking-wide">
                                {ready
                                    ? "탑승 준비 완료"
                                    : "비행 시스템 초기화 중..."}
                            </p>
                            <p className="text-[9px] font-mono text-[#9a9080]">
                                {Math.round(progress)}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Perforated edge */}
                <div className="relative w-5 bg-[#f5f0e8] flex flex-col items-center justify-around py-0">
                    <div className="absolute left-0 top-0 bottom-0 border-l-2 border-dashed border-[#d8d0c0]" />
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-4 h-4 rounded-full bg-[#0a0806] z-10 -ml-px"
                        />
                    ))}
                </div>

                {/* Stub */}
                <div className="w-36 bg-[#ede8de] px-4 py-5 flex flex-col items-center justify-between">
                    <div className="text-center">
                        <p className="text-[8px] tracking-widest uppercase text-[#9a9080] mb-0.5">
                            Flight
                        </p>
                        <p className="font-bold text-[#1a1410] text-[13px]">
                            FR-001
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[8px] tracking-widest uppercase text-[#9a9080] mb-0.5">
                            Duration
                        </p>
                        <p className="font-bold text-[#1a1410] text-[13px]">
                            {plannedDuration
                                ? formatDuration(plannedDuration)
                                : "—"}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[8px] tracking-widest uppercase text-[#9a9080] mb-0.5">
                            Departs
                        </p>
                        <p className="font-bold text-[#1a1410] text-[14px] tracking-wider">
                            {timeStr}
                        </p>
                    </div>
                    {/* Barcode */}
                    <div className="flex gap-px h-8">
                        {BARCODE.map((on, i) => (
                            <div
                                key={i}
                                className={`w-[3px] h-full rounded-[1px] ${on ? "bg-[#1a1410]" : "bg-transparent"}`}
                                style={{
                                    opacity: on ? 0.6 + (i % 4) * 0.1 : 0,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
