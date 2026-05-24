"use client";

import Link from "next/link";

const STATS = [
    { label: "누적 비행 시간", value: "0h 00m", sub: "총 학습 시간" },
    { label: "총 비행 거리", value: "0 km", sub: "이동 거리" },
    { label: "방문 공항", value: "0곳", sub: "목적지" },
    { label: "오늘 공부", value: "0h 00m", sub: "오늘" },
];

const CALENDAR_WEEKS = 52;
const DAYS_PER_WEEK = 7;

function PlaneIcon({ size = 18 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
    );
}

function HeatmapCalendar() {
    return (
        <div className="bg-black/20 backdrop-blur-sm border border-white/[0.06] rounded-2xl px-6 py-5">
            <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] text-white/30 tracking-widest uppercase">
                    비행 캘린더
                </p>
                <p className="text-[10px] text-white/20">최근 1년</p>
            </div>
            <div className="flex gap-[3px]">
                {Array.from({ length: CALENDAR_WEEKS }).map((_, w) => (
                    <div key={w} className="flex flex-col gap-[3px]">
                        {Array.from({ length: DAYS_PER_WEEK }).map((_, d) => (
                            <div
                                key={d}
                                className="w-[10px] h-[10px] rounded-[2px] bg-white/[0.04]"
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-1.5 mt-3 justify-end">
                <span className="text-[9px] text-white/20">적음</span>
                {[0.04, 0.15, 0.3, 0.5, 0.75].map((opacity, i) => (
                    <div
                        key={i}
                        className="w-[10px] h-[10px] rounded-[2px] bg-sky-400"
                        style={{ opacity }}
                    />
                ))}
                <span className="text-[9px] text-white/20">많음</span>
            </div>
        </div>
    );
}

export default function RecordsPage() {
    return (
        <main className="relative w-full min-h-screen bg-[#0a0806] overflow-hidden flex flex-col">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080d18] via-[#0a0806] to-[#060608]" />

            <header className="relative z-10 flex items-center justify-between px-10 pt-8">
                <div className="flex items-center gap-2.5 text-white">
                    <PlaneIcon size={18} />
                    <Link
                        href="/"
                        className="font-semibold tracking-[0.25em] text-[13px] uppercase text-white/80 hover:text-white transition-colors"
                    >
                        Flightrail
                    </Link>
                </div>
                <nav className="flex items-center gap-3">
                    <span className="px-4 py-2 text-white/70 text-[13px] tracking-wide rounded-xl bg-white/[0.06]">
                        기록
                    </span>
                </nav>
            </header>

            <div className="relative z-10 px-10 py-10 space-y-4 flex-1">
                <div className="mb-2">
                    <h2 className="text-white text-2xl font-bold tracking-tight">
                        비행 기록
                    </h2>
                    <p className="text-white/30 text-[13px] mt-1">
                        지금까지의 공부 여행 요약
                    </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-3">
                    {STATS.map(({ label, value }) => (
                        <div
                            key={label}
                            className="bg-black/20 backdrop-blur-sm border border-white/[0.06] rounded-2xl px-5 py-5"
                        >
                            <p className="text-2xl font-bold text-white tabular-nums tracking-tight leading-none">
                                {value}
                            </p>
                            <p className="text-[10px] text-white/30 mt-1.5 tracking-widest uppercase">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Heatmap calendar */}
                <HeatmapCalendar />

                {/* Trip list */}
                <div className="bg-black/20 backdrop-blur-sm border border-white/[0.06] rounded-2xl px-6 py-5">
                    <p className="text-[10px] text-white/30 tracking-widest uppercase mb-4">
                        여행 목록
                    </p>
                    <p className="text-white/20 text-[13px] text-center py-6">
                        아직 비행 기록이 없습니다. 첫 출발을 시작해보세요.
                    </p>
                </div>
            </div>
        </main>
    );
}
