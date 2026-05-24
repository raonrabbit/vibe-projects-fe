"use client";

import Link from "next/link";
import { useState } from "react";

import { PassportButton } from "@/features/auth";
import { DepartureModal } from "@/widgets/departure-modal";

function PlaneIcon({ size = 20 }: { size?: number }) {
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

export default function HomePage() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <main className="relative w-full h-screen bg-[#0a0806] overflow-hidden flex flex-col">
            {/* Atmosphere */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080d18] via-[#0a0806] to-[#060608]" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-sky-950/20 to-transparent" />

            {/* Decorative flight arc */}
            <svg
                className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.04]"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
            >
                <path
                    d="M 120 760 Q 720 120 1320 680"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeDasharray="6 10"
                />
                <circle cx="120" cy="760" r="5" fill="white" />
                <circle cx="1320" cy="680" r="5" fill="white" />
            </svg>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-10 pt-8">
                <div className="flex items-center gap-2.5 text-white">
                    <PlaneIcon size={18} />
                    <span className="font-semibold tracking-[0.25em] text-[13px] uppercase text-white/80">
                        Flightrail
                    </span>
                </div>
                <nav className="flex items-center gap-3">
                    <Link
                        href="/records"
                        className="px-4 py-2 text-white/35 hover:text-white/65 text-[13px] transition-colors tracking-wide rounded-xl hover:bg-white/5"
                    >
                        기록
                    </Link>
                    <PassportButton />
                </nav>
            </header>

            {/* Hero */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                <p className="text-[10px] text-white/20 tracking-[0.45em] uppercase mb-6">
                    Ready for Takeoff
                </p>
                <h1 className="text-[84px] font-bold text-white tracking-[-0.02em] leading-none mb-4">
                    Flightrail
                </h1>
                <p className="text-white/30 text-[15px] tracking-wide mb-12">
                    공부 시간을 비행 여행으로 기록하세요
                </p>

                <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-2.5 px-9 py-3.5 bg-sky-600/90 hover:bg-sky-500 text-white rounded-2xl font-semibold text-[15px] transition-all duration-200 tracking-wide shadow-lg shadow-sky-900/30"
                >
                    <PlaneIcon size={17} />
                    출발하기
                </button>
            </div>

            {/* Departure modal */}
            {modalOpen && (
                <DepartureModal onClose={() => setModalOpen(false)} />
            )}
        </main>
    );
}
