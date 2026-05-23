"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "../model/useAuth";

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18">
            <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
            />
            <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                fill="#34A853"
            />
            <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
            />
            <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
            />
        </svg>
    );
}

function Emblem() {
    return (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.4"
            />
            <circle
                cx="32"
                cy="32"
                r="20"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeOpacity="0.25"
            />
            <path
                d="M4 32h56M32 4v56"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeOpacity="0.2"
            />
            <ellipse
                cx="32"
                cy="32"
                rx="10"
                ry="28"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeOpacity="0.15"
            />
            <path
                d="M39 27v-2.5l-8-4.5V14a1.5 1.5 0 0 0-3 0v6l-8 4.5V27l8-2.5V30l-2 1.5V34l3.5-1 3.5 1v-2.5L31 30v-5.5l8 2.5z"
                fill="currentColor"
                fillOpacity="0.7"
            />
        </svg>
    );
}

function MrzLine(text: string, total = 44) {
    const padded = text.padEnd(total, "<").slice(0, total);
    return padded;
}

export default function PassportPage() {
    const { user, loading, signIn, signOut } = useAuth();

    const displayName = user?.user_metadata?.full_name as string | undefined;
    const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

    const mrz1 = MrzLine(
        `P<KOR${(displayName ?? "TRAVELER").toUpperCase().replace(/\s+/g, "<")}`,
    );
    const mrz2 = MrzLine(
        `FL${(user?.id ?? "0".repeat(9)).slice(0, 9).toUpperCase()}6KOR9001011`,
    );

    return (
        <div className="min-h-screen bg-[#0a0806] flex flex-col items-center justify-center gap-6">
            <Link
                href="/"
                className="flex items-center gap-2 text-white/30 hover:text-white/60 text-[13px] transition-colors"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                홈으로
            </Link>

            {/* Passport book */}
            <div className="flex shadow-2xl shadow-black/80 rounded-2xl overflow-hidden">
                {/* Left page — cover */}
                <div className="w-72 bg-[#0e2318] px-8 py-10 flex flex-col items-center justify-between text-[#c8a040] select-none relative overflow-hidden">
                    {/* background pattern */}
                    <div className="absolute inset-0 opacity-[0.04]">
                        {Array.from({ length: 8 }).map((_, r) =>
                            Array.from({ length: 6 }).map((_, c) => (
                                <div
                                    key={`${r}-${c}`}
                                    className="absolute w-12 h-12 rounded-full border border-current"
                                    style={{
                                        top: r * 56 - 12,
                                        left: c * 56 - 12,
                                    }}
                                />
                            )),
                        )}
                    </div>

                    {/* Spine line */}
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-black/30" />

                    <div className="text-[9px] tracking-[0.3em] uppercase opacity-50">
                        Study Travel Document
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <Emblem />
                        <div className="text-center">
                            <p className="text-[10px] tracking-[0.35em] uppercase opacity-50 mb-1">
                                Republic of
                            </p>
                            <p className="text-[26px] font-bold tracking-wider leading-none">
                                FLIGHTRAIL
                            </p>
                            <p className="text-[11px] tracking-[0.4em] uppercase mt-2 opacity-60">
                                Passport
                            </p>
                        </div>
                    </div>

                    <div className="text-[9px] tracking-widest opacity-30 uppercase">
                        Study Journal
                    </div>
                </div>

                {/* Right page — data page */}
                <div className="w-80 bg-[#f8f3ec] px-7 py-7 flex flex-col">
                    {/* Photo + basic info */}
                    <div className="flex gap-4 mb-5">
                        <div className="w-24 h-28 bg-[#e4ddd0] border border-[#cdc5b5] flex items-center justify-center overflow-hidden flex-shrink-0 rounded-sm">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt="profile"
                                    width={96}
                                    height={112}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <svg
                                    width="40"
                                    height="48"
                                    viewBox="0 0 40 48"
                                    fill="none"
                                >
                                    <circle
                                        cx="20"
                                        cy="15"
                                        r="10"
                                        fill="#b8b0a0"
                                    />
                                    <path
                                        d="M0 48c0-11.046 8.954-20 20-20s20 8.954 20 20"
                                        fill="#b8b0a0"
                                    />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1 pt-0.5 min-w-0">
                            <p className="text-[8px] text-[#9a9080] tracking-widest uppercase mb-0.5">
                                Surname / Given Name
                            </p>
                            <p className="font-bold text-[#1e1810] text-[13px] leading-snug truncate">
                                {displayName ?? "— / —"}
                            </p>
                            <p className="text-[8px] text-[#9a9080] tracking-widest uppercase mt-3 mb-0.5">
                                Nationality
                            </p>
                            <p className="font-semibold text-[#1e1810] text-[12px]">
                                FLIGHTRAIL
                            </p>
                            <p className="text-[8px] text-[#9a9080] tracking-widest uppercase mt-3 mb-0.5">
                                Status
                            </p>
                            <span
                                className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded ${
                                    user
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-[#e8e0d0] text-[#9a9080]"
                                }`}
                            >
                                {user ? "ACTIVE" : "NOT ISSUED"}
                            </span>
                        </div>
                    </div>

                    {/* Fields grid */}
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3 mb-4">
                        {[
                            {
                                label: "Passport No.",
                                value: user
                                    ? `FL-${user.id.slice(0, 6).toUpperCase()}`
                                    : "—",
                            },
                            {
                                label: "Date of Issue",
                                value: user
                                    ? new Date().toLocaleDateString("en-GB")
                                    : "—",
                            },
                            { label: "Expiry", value: "—" },
                            { label: "Provider", value: user ? "Google" : "—" },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <p className="text-[8px] text-[#9a9080] tracking-widest uppercase mb-0.5">
                                    {label}
                                </p>
                                <p className="text-[12px] font-semibold text-[#1e1810]">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* MRZ */}
                    <div className="border-t border-dashed border-[#cdc5b5] pt-3 mb-4">
                        <p className="font-mono text-[8px] text-[#9a9080] tracking-[0.08em] leading-relaxed break-all">
                            {mrz1}
                            <br />
                            {mrz2}
                        </p>
                    </div>

                    {/* Auth button */}
                    <div className="mt-auto">
                        {loading ? (
                            <div className="h-10 bg-[#e8e0d0] rounded-xl animate-pulse" />
                        ) : user ? (
                            <button
                                onClick={signOut}
                                className="w-full py-2.5 border border-[#cdc5b5] rounded-xl text-[13px] font-medium text-[#4a4030] hover:bg-[#ede8de] transition-colors"
                            >
                                로그아웃
                            </button>
                        ) : (
                            <button
                                onClick={signIn}
                                className="w-full py-2.5 bg-white border border-[#d0c8b8] rounded-xl text-[13px] font-medium text-[#2a2018] hover:bg-[#f4f0e8] transition-colors flex items-center justify-center gap-2.5 shadow-sm"
                            >
                                <GoogleIcon />
                                Google로 계속하기
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-[11px] text-white/20">
                로그인하면 비행 기록이 저장됩니다
            </p>
        </div>
    );
}
