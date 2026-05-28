"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getAirport } from "@/entities/airport";
import { getSessions, type Session } from "@/entities/session";

function formatHM(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${String(m).padStart(2, "0")}m`;
}

function formatDate(isoStr: string) {
    return new Date(isoStr).toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
    });
}

function sessionDuration(s: Session) {
    const secs =
        (new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) /
        1000;
    return formatHM(secs);
}

function sessionSeconds(s: Session) {
    return (
        (new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) /
        1000
    );
}

function heatOpacity(seconds: number, isFuture: boolean) {
    if (isFuture || seconds === 0) return 0.04;
    if (seconds < 1800) return 0.15;
    if (seconds < 3600) return 0.3;
    if (seconds < 7200) return 0.55;
    return 0.85;
}

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

function StatusBadge({ status }: { status: Session["arrival_status"] }) {
    const map = {
        ontime: { label: "정시", cls: "bg-sky-500/20 text-sky-400" },
        delayed: { label: "연착", cls: "bg-amber-500/20 text-amber-400" },
        emergency_landing: {
            label: "비상착륙",
            cls: "bg-rose-500/20 text-rose-400",
        },
    };
    const { label, cls } = map[status] ?? map.emergency_landing;
    return (
        <span
            className={`text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full ${cls}`}
        >
            {label}
        </span>
    );
}

function HeatmapCalendar({ sessions }: { sessions: Session[] }) {
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const weeks = useMemo(() => {
        const map = new Map<string, number>();
        for (const s of sessions) {
            const d = new Date(s.started_at);
            d.setHours(0, 0, 0, 0);
            const key = d.toLocaleDateString("en-CA");
            map.set(key, (map.get(key) ?? 0) + sessionSeconds(s));
        }

        const dayOfWeek = today.getDay();
        const gridStart = new Date(today);
        gridStart.setDate(today.getDate() - dayOfWeek - 51 * 7);

        return Array.from({ length: 52 }, (_, w) =>
            Array.from({ length: 7 }, (_, d) => {
                const date = new Date(gridStart);
                date.setDate(gridStart.getDate() + w * 7 + d);
                const key = date.toLocaleDateString("en-CA");
                return {
                    key,
                    seconds: map.get(key) ?? 0,
                    isFuture: date > today,
                };
            }),
        );
    }, [sessions, today]);

    return (
        <div className="bg-black/20 backdrop-blur-sm border border-white/[0.06] rounded-2xl px-6 py-5">
            <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] text-white/30 tracking-widest uppercase">
                    비행 캘린더
                </p>
                <p className="text-[10px] text-white/20">최근 1년</p>
            </div>
            <div className="flex gap-[3px]">
                {weeks.map((week, w) => (
                    <div key={w} className="flex flex-col gap-[3px]">
                        {week.map((cell) => (
                            <div
                                key={cell.key}
                                title={
                                    cell.seconds > 0
                                        ? `${cell.key}: ${formatHM(cell.seconds)}`
                                        : cell.key
                                }
                                className="w-[10px] h-[10px] rounded-[2px] bg-sky-400"
                                style={{
                                    opacity: heatOpacity(
                                        cell.seconds,
                                        cell.isFuture,
                                    ),
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-1.5 mt-3 justify-end">
                <span className="text-[9px] text-white/20">적음</span>
                {[0.04, 0.15, 0.3, 0.55, 0.85].map((opacity, i) => (
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

function TripRow({ session }: { session: Session }) {
    const from = getAirport(session.departure_airport);
    const to = getAirport(session.destination_airport);

    return (
        <div className="flex items-center gap-4 py-3 border-b border-white/[0.04] last:border-0">
            <div className="text-[11px] text-white/25 w-14 flex-shrink-0">
                {formatDate(session.started_at)}
            </div>

            <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="text-center flex-shrink-0">
                    <p className="text-[13px] font-bold text-white leading-none">
                        {session.departure_airport}
                    </p>
                    <p className="text-[9px] text-white/25 mt-0.5 leading-none">
                        {from?.city ?? ""}
                    </p>
                </div>
                <svg
                    width="24"
                    height="10"
                    viewBox="0 0 24 10"
                    fill="none"
                    className="flex-shrink-0"
                >
                    <line
                        x1="0"
                        y1="5"
                        x2="18"
                        y2="5"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                    />
                    <path
                        d="M18 5 l-4-2.5 l0 5 z"
                        fill="rgba(255,255,255,0.18)"
                    />
                </svg>
                <div className="text-center flex-shrink-0">
                    <p className="text-[13px] font-bold text-white leading-none">
                        {session.destination_airport}
                    </p>
                    <p className="text-[9px] text-white/25 mt-0.5 leading-none">
                        {to?.city ?? ""}
                    </p>
                </div>
                {session.subject && (
                    <span className="ml-2 text-[11px] text-sky-400/60 truncate">
                        {session.subject}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[12px] text-white/40 tabular-nums">
                    {sessionDuration(session)}
                </span>
                <StatusBadge status={session.arrival_status} />
            </div>
        </div>
    );
}

export default function RecordsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSessions().then((data) => {
            setSessions(data);
            setLoading(false);
        });
    }, []);

    const totalSeconds = useMemo(
        () => sessions.reduce((sum, s) => sum + sessionSeconds(s), 0),
        [sessions],
    );

    const totalKm = Math.round((totalSeconds / 3600) * 900);

    const uniqueAirports = useMemo(
        () => new Set(sessions.map((s) => s.destination_airport)).size,
        [sessions],
    );

    const todaySeconds = useMemo(() => {
        const todayStr = new Date().toLocaleDateString("en-CA");
        return sessions
            .filter(
                (s) =>
                    new Date(s.started_at).toLocaleDateString("en-CA") ===
                    todayStr,
            )
            .reduce((sum, s) => sum + sessionSeconds(s), 0);
    }, [sessions]);

    const stats = [
        {
            label: "누적 비행 시간",
            value: loading ? "—" : formatHM(totalSeconds),
        },
        {
            label: "총 비행 거리",
            value: loading ? "—" : `${totalKm.toLocaleString()} km`,
        },
        {
            label: "방문 공항",
            value: loading ? "—" : `${uniqueAirports}곳`,
        },
        {
            label: "오늘 공부",
            value: loading ? "—" : formatHM(todaySeconds),
        },
    ];

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
                    {stats.map(({ label, value }) => (
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
                <HeatmapCalendar sessions={sessions} />

                {/* Trip list */}
                <div className="bg-black/20 backdrop-blur-sm border border-white/[0.06] rounded-2xl px-6 py-5">
                    <p className="text-[10px] text-white/30 tracking-widest uppercase mb-4">
                        여행 목록
                    </p>
                    {loading ? (
                        <p className="text-white/20 text-[13px] text-center py-6">
                            불러오는 중...
                        </p>
                    ) : sessions.length === 0 ? (
                        <p className="text-white/20 text-[13px] text-center py-6">
                            아직 비행 기록이 없습니다. 첫 출발을 시작해보세요.
                        </p>
                    ) : (
                        <div>
                            {sessions.slice(0, 20).map((s) => (
                                <TripRow key={s.id} session={s} />
                            ))}
                            {sessions.length > 20 && (
                                <p className="text-[11px] text-white/20 text-center mt-3">
                                    총 {sessions.length}개 중 최근 20개 표시
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
