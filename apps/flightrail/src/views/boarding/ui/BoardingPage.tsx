"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { getAirport } from "@/entities/airport";
import { PlaneIcon } from "@/shared/ui/icons";

function formatDuration(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h === 0) return `${String(m).padStart(2, "0")}m`;
    if (m === 0) return `${String(h).padStart(2, "0")}h`;
    return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
}

function clamp01(v: number) {
    return Math.max(0, Math.min(1, v));
}

const SEAT_COLS = ["A", "B", "C", "D", "E", "F"] as const;
const SEAT_ROWS = 8;
const PICKED_COL = "A";

function randInt(min: number, max: number) {
    const range = max - min + 1;
    const r = new Uint32Array(1);
    crypto.getRandomValues(r);
    return min + (r[0] % range);
}

function shuffleInPlace<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
        const r = new Uint32Array(1);
        crypto.getRandomValues(r);
        const j = r[0] % (i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function BoardingPage() {
    const router = useRouter();
    const sp = useSearchParams();

    const info = useMemo(() => {
        const from = sp.get("from") ?? "ICN";
        const to = sp.get("to") ?? "—";
        const subject = sp.get("subject") ?? "";
        const duration = Number(sp.get("duration") ?? "0");
        const hardStop = sp.get("hardStop") === "true";
        return { from, to, subject, duration, hardStop };
    }, [sp]);

    const fromAirport = useMemo(() => getAirport(info.from), [info.from]);
    const toAirport = useMemo(() => getAirport(info.to), [info.to]);

    const pickedSeat = useMemo(() => {
        const row = randInt(1, SEAT_ROWS);
        return `${row}${PICKED_COL}`;
    }, []);

    const [progress, setProgress] = useState(0);
    const [pickedReady, setPickedReady] = useState(false);
    const [seatFading, setSeatFading] = useState(false);
    const [takingOff, setTakingOff] = useState(false);
    const startedAtRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleCancel = () => {
        const a = audioRef.current;
        if (a) {
            a.pause();
            a.currentTime = 0;
            a.volume = 0;
        }
        router.push("/");
    };

    useEffect(() => {
        const qs = sp.toString();
        router.prefetch(`/timer?${qs}`);

        startedAtRef.current = performance.now();
        const minMs = 5000;

        let raf = 0;
        const tick = () => {
            const startedAt = startedAtRef.current ?? performance.now();
            const elapsed = performance.now() - startedAt;
            const t = clamp01(elapsed / minMs);

            const eased = 1 - Math.pow(1 - t, 2.6);
            setProgress(Math.round(eased * 100));

            if (elapsed >= minMs) {
                setProgress(100);
                setPickedReady(true);
                return;
            }

            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        if (!takingOff) return;
        const qs = sp.toString();
        const a = audioRef.current;
        if (!a) return;

        a.currentTime = 0;
        a.volume = 0.05;

        const p = a.play();
        if (p) p.catch(() => {});

        const fadeMs = 900;
        const start = performance.now();
        let raf = 0;
        const tick = () => {
            const t = clamp01((performance.now() - start) / fadeMs);
            a.volume = 0.05 + 0.95 * t;
            if (t >= 1) return;
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        const nav = setTimeout(() => {
            router.push(`/timer?${qs}`);
        }, 1100);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(nav);
        };
    }, [takingOff]);

    const now = useMemo(() => new Date(), []);
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const seatIds = useMemo(() => {
        const ids: string[] = [];
        for (let r = 1; r <= SEAT_ROWS; r++) {
            for (const c of SEAT_COLS) ids.push(`${r}${c}`);
        }
        return ids;
    }, []);

    const fillOrder = useMemo(() => {
        const ids = seatIds.filter((id) => id !== pickedSeat);
        return shuffleInPlace(ids);
    }, [seatIds, pickedSeat]);

    const filledCount = useMemo(() => {
        const n = fillOrder.length;
        return Math.min(n, Math.floor((progress / 100) * n));
    }, [progress, fillOrder.length]);

    const fillSet = useMemo(
        () => new Set(fillOrder.slice(0, filledCount)),
        [fillOrder, filledCount],
    );

    const picked = pickedReady ? pickedSeat : null;
    const [pickedBouncing, setPickedBouncing] = useState(false);

    useEffect(() => {
        if (!pickedReady) return;
        setPickedBouncing(true);
        const t = setTimeout(() => setPickedBouncing(false), 700);
        return () => clearTimeout(t);
    }, [pickedReady]);

    return (
        <main className="relative min-h-screen bg-fr-base overflow-hidden">
            <style>{`
                @keyframes frPlaneTakeoff {
                    0%   { transform: translate3d(0, 24px, 0) scale(0.9); opacity: 0; }
                    15%  { opacity: 1; }
                    100% { transform: translate3d(0, -320px, 0) scale(1.55); opacity: 1; }
                }
                @keyframes frFadeOut {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes frSeatBounce {
                    0%   { transform: scale(1); }
                    20%  { transform: scale(1.18); }
                    45%  { transform: scale(0.94); }
                    70%  { transform: scale(1.10); }
                    100% { transform: scale(1); }
                }
            `}</style>

            <audio ref={audioRef} src="/audios/cabin.mp3" preload="auto" />

            <div
                className="pointer-events-none absolute inset-0 bg-fr-base"
                style={{
                    animation: takingOff
                        ? "frFadeOut 900ms ease-in forwards"
                        : undefined,
                }}
            />

            <div className="absolute inset-0">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(56,189,248,0.10),transparent)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_110%,rgba(255,255,255,0.06),transparent)]" />
            </div>

            <div
                className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10"
                style={{
                    animation: takingOff
                        ? "frFadeOut 900ms ease-in forwards"
                        : undefined,
                }}
            >
                <div className="w-full max-w-[420px]">
                    <div
                        className="rounded-3xl overflow-hidden shadow-2xl shadow-black/70 select-none transition-opacity duration-600"
                        style={{ opacity: seatFading ? 0 : 1 }}
                    >
                        <div className="bg-fr-parchment-mid px-6 pt-6 pb-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] tracking-[0.35em] uppercase text-fr-ink-dim">
                                        Boarding Pass
                                    </p>
                                    <p className="text-[10px] text-fr-ink-dim mt-1">
                                        {dateStr} • {timeStr}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-fr-ink opacity-80">
                                        <PlaneIcon size={14} />
                                    </div>
                                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-fr-ink">
                                        Flightrail
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 flex items-end justify-between">
                                <div>
                                    <p className="text-[42px] font-bold text-fr-ink tracking-tight leading-none">
                                        {info.from}
                                    </p>
                                    <p className="text-[10px] text-fr-ink-dim mt-1 leading-none">
                                        {fromAirport?.name ?? info.from}
                                    </p>
                                </div>

                                <div className="flex-1 px-4 pb-3">
                                    <div className="border-t border-dashed border-fr-parchment-border" />
                                    <p className="text-center text-[9px] tracking-[0.35em] uppercase text-fr-ink-dim mt-2">
                                        en route
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-[42px] font-bold text-fr-parchment-border tracking-tight leading-none">
                                        {info.to}
                                    </p>
                                    <p className="text-[10px] text-fr-ink-dim mt-1 leading-none">
                                        {toAirport?.name ?? " "}
                                    </p>
                                </div>
                            </div>

                            {info.subject && (
                                <div className="mt-4 rounded-2xl bg-fr-parchment border border-fr-parchment-muted px-4 py-3">
                                    <p className="text-[9px] tracking-[0.35em] uppercase text-fr-ink-dim">
                                        Study
                                    </p>
                                    <p className="text-[13px] font-semibold text-fr-ink mt-1">
                                        {info.subject}
                                    </p>
                                </div>
                            )}

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-fr-parchment border border-fr-parchment-muted px-4 py-3">
                                    <p className="text-[9px] tracking-[0.35em] uppercase text-fr-ink-dim">
                                        Duration
                                    </p>
                                    <p className="text-[13px] font-bold text-fr-ink mt-1">
                                        {info.duration
                                            ? formatDuration(info.duration)
                                            : "—"}
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-fr-parchment border border-fr-parchment-muted px-4 py-3">
                                    <p className="text-[9px] tracking-[0.35em] uppercase text-fr-ink-dim">
                                        Landing
                                    </p>
                                    <p className="text-[13px] font-bold text-fr-ink mt-1">
                                        {info.hardStop ? "Auto" : "Manual"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] tracking-[0.35em] uppercase text-fr-ink-dim">
                                        Seat Selection
                                    </p>
                                    <p className="text-[10px] font-mono text-fr-ink-dim">
                                        {progress}%
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-fr-parchment border border-fr-parchment-muted px-4 py-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-[10px] text-fr-ink-dim tracking-wide">
                                            {picked
                                                ? `${picked} 좌석 선택 완료`
                                                : "좌석 배정 중..."}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 text-[9px] text-fr-ink-dim">
                                                <span className="w-2.5 h-2.5 rounded-[3px] bg-fr-parchment-mid border border-fr-parchment-muted" />
                                                빈좌석
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-[9px] text-fr-ink-dim">
                                                <span className="w-2.5 h-2.5 rounded-[3px] bg-fr-ink-dim/55 border border-fr-ink-dim/70" />
                                                배정중
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-[9px] text-fr-ink-dim">
                                                <span className="w-2.5 h-2.5 rounded-[3px] bg-fr-sky/70 border border-fr-sky" />
                                                선택됨
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-3">
                                        <div className="flex flex-col items-center">
                                            <p className="text-[9px] tracking-[0.35em] uppercase text-fr-ink-dim mb-2">
                                                front
                                            </p>
                                            <div className="grid grid-cols-[repeat(3,18px)_10px_repeat(3,18px)] gap-2">
                                                {Array.from(
                                                    { length: SEAT_ROWS },
                                                    (_, rIdx) => rIdx + 1,
                                                ).flatMap((row) =>
                                                    SEAT_COLS.flatMap(
                                                        (col, _cIdx) => {
                                                            const id = `${row}${col}`;
                                                            const isPicked =
                                                                picked === id;
                                                            const isFilling =
                                                                !isPicked &&
                                                                fillSet.has(id);
                                                            const cls = isPicked
                                                                ? "bg-fr-sky/70 border-fr-sky"
                                                                : isFilling
                                                                  ? "bg-fr-ink-dim/55 border-fr-ink-dim/70"
                                                                  : "bg-fr-parchment-mid border-fr-parchment-muted";

                                                            const cells = [
                                                                <div
                                                                    key={id}
                                                                    className={`w-[18px] h-[18px] rounded-[6px] border transition-colors duration-150 ${cls}`}
                                                                    style={{
                                                                        boxShadow:
                                                                            isPicked
                                                                                ? "0 0 0 3px rgba(56,189,248,0.18)"
                                                                                : undefined,
                                                                        animation:
                                                                            isPicked &&
                                                                            pickedBouncing
                                                                                ? "frSeatBounce 650ms cubic-bezier(.2,.9,.25,1) both"
                                                                                : undefined,
                                                                    }}
                                                                    title={id}
                                                                />,
                                                            ];

                                                            if (col === "C") {
                                                                cells.push(
                                                                    <div
                                                                        key={`${row}-aisle`}
                                                                        className="w-[10px]"
                                                                    />,
                                                                );
                                                            }

                                                            return cells;
                                                        },
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 flex justify-end">
                                    <button
                                        onClick={handleCancel}
                                        disabled={takingOff}
                                        className={`mr-2 px-4 py-3 rounded-2xl text-[13px] font-semibold transition-colors ${
                                            takingOff
                                                ? "text-fr-ink-dim cursor-not-allowed opacity-50 bg-fr-parchment-dim border border-fr-parchment-border"
                                                : "text-fr-ink-mid hover:text-fr-ink bg-fr-parchment-dim border border-fr-parchment-border hover:bg-fr-parchment-muted"
                                        }`}
                                    >
                                        여행 취소
                                    </button>
                                    <button
                                        disabled={
                                            !pickedReady ||
                                            seatFading ||
                                            takingOff
                                        }
                                        onClick={() => {
                                            setSeatFading(true);
                                            setTimeout(() => {
                                                setTakingOff(true);
                                            }, 650);
                                        }}
                                        className={`px-5 py-3 rounded-2xl font-semibold text-[13px] tracking-wide transition-all ${
                                            pickedReady &&
                                            !seatFading &&
                                            !takingOff
                                                ? "bg-fr-sky-deep text-white hover:bg-fr-sky-deep/90 active:bg-fr-sky-deep"
                                                : "bg-black/5 text-fr-ink-dim cursor-not-allowed"
                                        }`}
                                    >
                                        출발
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="relative bg-fr-parchment-mid">
                            <div className="absolute inset-x-0 top-0 h-px bg-fr-parchment-border" />
                            <div className="flex items-center justify-center py-4">
                                <div className="flex gap-2">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-fr-base"
                                            style={{
                                                opacity: 0.08 + (i % 4) * 0.04,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-28 mt-8">
                        <div
                            className="absolute left-1/2 bottom-0 -translate-x-1/2 text-white/70"
                            style={{
                                animation: takingOff
                                    ? "frPlaneTakeoff 1100ms cubic-bezier(.16,.84,.22,1) forwards"
                                    : undefined,
                                opacity: takingOff ? 1 : 0,
                            }}
                        >
                            <PlaneIcon size={54} />
                        </div>
                        {!takingOff && (
                            <div className="absolute inset-0 flex items-end justify-center">
                                <p className="text-[10px] tracking-[0.45em] uppercase text-white/20 pb-2">
                                    boarding
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
