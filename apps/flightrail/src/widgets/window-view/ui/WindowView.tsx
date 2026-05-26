"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { type Airport, findDestination, getAirport } from "@/entities/airport";
import { saveSession } from "@/entities/session";
import { haversineKm } from "@/shared/lib/mapUtils";
import BoardingTicket from "@/shared/ui/BoardingTicket";

import { MiniMap } from "./MiniMap";
import TimeBar, { type TimeMode } from "./TimeBar";
import type { CabinLightMode } from "./WindowScene";

const WindowScene = dynamic(() => import("./WindowScene"), { ssr: false });
const LiveMapCanvas = dynamic(() => import("./LiveMapCanvas"), { ssr: false });

interface LandResult {
    destination: Airport | null;
    fromAirport: Airport | undefined;
    arrivalStatus: "ontime" | "delayed" | "abandoned";
    elapsed: number;
    subject: string;
}

function getLocalHour() {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
}

function formatElapsed(s: number) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function formatDistance(s: number) {
    const km = Math.round((s / 3600) * 900);
    return `${km.toLocaleString()} km`;
}

function skyClockDisplay(hour: number) {
    const n = ((hour % 24) + 24) % 24;
    const h = Math.floor(n);
    const m = Math.floor((n % 1) * 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function AnalogClock({ hour }: { hour: number }) {
    const n = ((hour % 24) + 24) % 24;
    const h12 = n % 12;
    const mins = (n % 1) * 60;
    const hourDeg = (h12 / 12) * 360 + (mins / 60) * 30;
    const minDeg = (mins / 60) * 360;

    const px = (len: number, deg: number) =>
        28 + len * Math.sin((deg * Math.PI) / 180);
    const py = (len: number, deg: number) =>
        28 - len * Math.cos((deg * Math.PI) / 180);

    return (
        <svg width="56" height="56" viewBox="0 0 56 56">
            <circle
                cx="28"
                cy="28"
                r="26"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                fill="rgba(0,0,0,0.15)"
            />
            {[0, 90, 180, 270].map((deg) => (
                <line
                    key={deg}
                    x1={px(20, deg)}
                    y1={py(20, deg)}
                    x2={px(23, deg)}
                    y2={py(23, deg)}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            ))}
            <line
                x1="28"
                y1="28"
                x2={px(14, hourDeg)}
                y2={py(14, hourDeg)}
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeOpacity="0.9"
            />
            <line
                x1="28"
                y1="28"
                x2={px(21, minDeg)}
                y2={py(21, minDeg)}
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeOpacity="0.6"
            />
            <circle cx="28" cy="28" r="2.5" fill="white" fillOpacity="0.9" />
        </svg>
    );
}

function LeftTooltip({ label }: { label: string }) {
    return (
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {label}
        </div>
    );
}

export default function WindowView() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const mode = (searchParams.get("mode") ?? "free") as "free" | "planned";
    const subject = searchParams.get("subject") ?? "";
    const from = searchParams.get("from") ?? "ICN";
    const plannedDuration =
        mode === "planned"
            ? Number(searchParams.get("duration") ?? 7200)
            : undefined;
    const toIata = searchParams.get("to") ?? undefined;
    const preSelectedDestination = toIata ? getAirport(toIata) : undefined;

    const startedAt = useRef(new Date());
    const [ready, setReady] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(true);
    const [reachedGoal, setReachedGoal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [landResult, setLandResult] = useState<LandResult | null>(null);

    const [showMap, setShowMap] = useState(false);

    const [cabinMode, setCabinMode] = useState<CabinLightMode>("auto");
    const [cabinOpen, setCabinOpen] = useState(false);
    const [clockOpen, setClockOpen] = useState(false);
    const [muted, setMuted] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const gainRef = useRef<GainNode | null>(null);

    const [timeMode, setTimeMode] = useState<TimeMode>("local");
    const [fromOffset, setFromOffset] = useState(0);
    const [fixedHour, setFixedHour] = useState(0);
    const [localHour, setLocalHour] = useState(0);

    useEffect(() => {
        const ctx = new AudioContext();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.4;
        masterGain.connect(ctx.destination);
        audioCtxRef.current = ctx;
        gainRef.current = masterGain;

        const CROSSFADE = 3; // seconds of overlap between loop iterations

        let timerId: ReturnType<typeof setTimeout> | null = null;

        const schedule = (
            buffer: AudioBuffer,
            when: number,
            fadeInDur: number,
        ) => {
            const source = ctx.createBufferSource();
            const segGain = ctx.createGain();
            source.buffer = buffer;
            source.connect(segGain);
            segGain.connect(masterGain);

            segGain.gain.setValueAtTime(0, when);
            segGain.gain.linearRampToValueAtTime(1, when + fadeInDur);
            segGain.gain.setValueAtTime(1, when + buffer.duration - CROSSFADE);
            segGain.gain.linearRampToValueAtTime(0, when + buffer.duration);

            source.start(when);
            source.stop(when + buffer.duration);

            const nextWhen = when + buffer.duration - CROSSFADE;
            const delayMs = (nextWhen - ctx.currentTime) * 1000 - 200;
            timerId = setTimeout(
                () => schedule(buffer, nextWhen, CROSSFADE),
                Math.max(0, delayMs),
            );
        };

        const startAudio = (decoded: AudioBuffer) => {
            schedule(decoded, ctx.currentTime, 2);
        };

        fetch("/audios/cabin.mp3")
            .then((r) => r.arrayBuffer())
            .then((buf) => ctx.decodeAudioData(buf))
            .then((decoded) => {
                if (ctx.state === "suspended") {
                    // 새로고침 등으로 제스처 없이 로드된 경우 — 첫 인터랙션에 재개
                    const resume = () => {
                        ctx.resume().then(() => startAudio(decoded));
                        window.removeEventListener("pointerdown", resume);
                        window.removeEventListener("keydown", resume);
                    };
                    window.addEventListener("pointerdown", resume, {
                        once: true,
                    });
                    window.addEventListener("keydown", resume, { once: true });
                } else {
                    startAudio(decoded);
                }
            })
            .catch(() => {});

        return () => {
            if (timerId !== null) clearTimeout(timerId);
            ctx.close();
        };
    }, []);

    useEffect(() => {
        const ctx = audioCtxRef.current;
        const gain = gainRef.current;
        if (!ctx || !gain) return;

        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);

        if (!running) {
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        } else {
            const target = muted ? 0 : 0.4;
            const dur = muted ? 0.15 : 0.5;
            gain.gain.linearRampToValueAtTime(target, ctx.currentTime + dur);
        }
    }, [running, muted]);

    useEffect(() => {
        setLocalHour(getLocalHour());
        const id = setInterval(() => setLocalHour(getLocalHour()), 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => setElapsed((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, [running]);

    // Mark goal reached for planned mode
    useEffect(() => {
        if (
            mode === "planned" &&
            plannedDuration &&
            elapsed >= plannedDuration &&
            !reachedGoal
        ) {
            setReachedGoal(true);
        }
    }, [elapsed, mode, plannedDuration, reachedGoal]);

    const displayHour =
        timeMode === "local"
            ? localHour
            : timeMode === "from"
              ? (((fromOffset + elapsed / 3600) % 24) + 24) % 24
              : fixedHour;

    const fromAirportData = useMemo(() => getAirport(from), [from]);

    const mapDestination = useMemo(() => {
        if (mode === "planned" && preSelectedDestination)
            return preSelectedDestination;
        return findDestination(from, elapsed) ?? fromAirportData ?? null;
    }, [mode, preSelectedDestination, from, elapsed, fromAirportData]);

    const routeTotalKm = useMemo(() => {
        if (!fromAirportData || !mapDestination) return 0;
        return haversineKm(
            fromAirportData.lat,
            fromAirportData.lng,
            mapDestination.lat,
            mapDestination.lng,
        );
    }, [fromAirportData, mapDestination]);

    const mapProgress = useMemo(() => {
        if (!routeTotalKm) return 0;
        const traveledKm = (elapsed / 3600) * 900;
        return Math.min(traveledKm / routeTotalKm, 1);
    }, [routeTotalKm, elapsed]);

    /** 초당 route progress 증가량 — 3D 비행기 연속 이동용 (elapsed는 1초마다만 갱신) */
    const mapProgressRate = useMemo(() => {
        if (!routeTotalKm) return 0;
        return 900 / 3600 / routeTotalKm;
    }, [routeTotalKm]);

    const handleModeChange = useCallback(
        (m: TimeMode) => {
            if (m === "from" && timeMode !== "from") {
                const cur = timeMode === "local" ? localHour : fixedHour;
                setFromOffset(cur - elapsed / 3600);
            } else if (m === "fixed" && timeMode !== "fixed") {
                const cur =
                    timeMode === "local"
                        ? localHour
                        : (((fromOffset + elapsed / 3600) % 24) + 24) % 24;
                setFixedHour(Math.floor(((cur % 24) + 24) % 24));
            }
            setTimeMode(m);
        },
        [timeMode, localHour, fixedHour, fromOffset, elapsed],
    );

    const handleBarDrag = useCallback(
        (hour: number) => {
            const effectiveMode = timeMode === "local" ? "from" : timeMode;
            if (effectiveMode === "from") {
                setFromOffset(hour - elapsed / 3600);
            } else {
                setFixedHour(hour);
            }
        },
        [timeMode, elapsed],
    );

    async function handleLand() {
        if (saving) return;
        setSaving(true);
        setRunning(false);

        let destination: ReturnType<typeof findDestination>;
        let arrivalStatus: "ontime" | "delayed" | "abandoned";

        if (mode === "planned" && plannedDuration !== undefined) {
            if (elapsed >= plannedDuration - 1800) {
                // 목표 30분 전 ~ 초과: 선택한 목적지 유지
                arrivalStatus =
                    elapsed > plannedDuration ? "delayed" : "ontime";
                destination =
                    preSelectedDestination ?? findDestination(from, elapsed);
            } else {
                // 30분 이상 일찍 포기: 실제 비행 거리 공항
                arrivalStatus = "abandoned";
                destination = findDestination(from, elapsed);
            }
        } else {
            arrivalStatus = "ontime";
            destination = findDestination(from, elapsed);
        }

        try {
            await saveSession({
                mode,
                subject,
                departureAirport: from,
                destinationAirport: destination?.iata ?? from,
                startedAt: startedAt.current,
                endedAt: new Date(),
                plannedDuration,
                arrivalStatus,
            });
        } catch {
            // silently fail — don't block navigation
        }

        setSaving(false);
        setLandResult({
            destination,
            fromAirport: getAirport(from),
            arrivalStatus,
            elapsed,
            subject,
        });
    }

    // Timer display values
    const timerMain = (() => {
        if (mode === "planned" && plannedDuration !== undefined) {
            if (elapsed < plannedDuration) {
                return {
                    value: formatElapsed(plannedDuration - elapsed),
                    label: "남은 시간",
                    delayed: false,
                };
            }
            return {
                value: formatElapsed(elapsed - plannedDuration),
                label: "연착 중",
                delayed: true,
            };
        }
        return {
            value: formatElapsed(elapsed),
            label: "비행 시간",
            delayed: false,
        };
    })();

    const modeLabel =
        timeMode === "local"
            ? "현재 시각"
            : timeMode === "from"
              ? "출발 기준"
              : "고정 시각";

    const btnCls =
        "w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors";

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#0a0806]">
            {/* 3D sky canvas — unmounted while map is open to avoid dual WebGL context */}
            {!showMap && (
                <div className="absolute inset-0">
                    <WindowScene
                        hour={displayHour}
                        cabinMode={cabinMode}
                        onReady={() => setReady(true)}
                    />
                </div>
            )}

            {/* 3D map view — rendered on top, shown when showMap is true */}
            {showMap && fromAirportData && mapDestination && (
                <LiveMapCanvas
                    fromLat={fromAirportData.lat}
                    fromLng={fromAirportData.lng}
                    toLat={mapDestination.lat}
                    toLng={mapDestination.lng}
                    progress={mapProgress}
                    progressRate={running ? mapProgressRate : 0}
                    hour={displayHour}
                    onClose={() => setShowMap(false)}
                />
            )}

            {/* Mini-map overlay — bottom-left of window view */}
            {ready && !landResult && fromAirportData && mapDestination && (
                <div
                    className={`absolute bottom-8 left-8 ${showMap ? "z-30" : "z-10"}`}
                >
                    <MiniMap
                        fromLat={fromAirportData.lat}
                        fromLng={fromAirportData.lng}
                        toLat={mapDestination.lat}
                        toLng={mapDestination.lng}
                        fromIata={fromAirportData.iata}
                        toIata={mapDestination.iata}
                        progress={mapProgress}
                    />
                </div>
            )}

            {/* Boarding ticket loading overlay */}
            <BoardingTicket ready={ready} />

            {/* Pause overlay */}
            {!running && !saving && !landResult && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md">
                    <p className="text-white/40 text-[11px] tracking-widest uppercase mb-5">
                        일시정지
                    </p>
                    <button
                        onClick={() => setRunning(true)}
                        className="px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white font-semibold text-[15px] transition-all"
                    >
                        재개하기
                    </button>
                    <button
                        onClick={handleLand}
                        className="mt-3 px-6 py-2.5 text-white/40 hover:text-white/70 text-[13px] transition-colors"
                    >
                        착륙 (세션 종료)
                    </button>
                </div>
            )}

            {/* Saving overlay */}
            {saving && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
                    <p className="text-white/60 text-[13px] tracking-widest uppercase">
                        착륙 중...
                    </p>
                </div>
            )}

            {/* Landing result overlay */}
            {landResult && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md">
                    <div className="w-[480px] bg-[#111210] border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">
                        {/* Status header */}
                        <div
                            className={`px-8 pt-6 pb-4 border-b border-white/[0.06] flex items-center justify-between ${
                                landResult.arrivalStatus === "ontime"
                                    ? "bg-sky-500/5"
                                    : landResult.arrivalStatus === "delayed"
                                      ? "bg-amber-500/5"
                                      : "bg-rose-500/5"
                            }`}
                        >
                            <p className="text-[10px] text-white/30 tracking-[0.4em] uppercase">
                                착륙 완료
                            </p>
                            <span
                                className={`text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full ${
                                    landResult.arrivalStatus === "ontime"
                                        ? "bg-sky-500/20 text-sky-400"
                                        : landResult.arrivalStatus === "delayed"
                                          ? "bg-amber-500/20 text-amber-400"
                                          : "bg-rose-500/20 text-rose-400"
                                }`}
                            >
                                {landResult.arrivalStatus === "ontime"
                                    ? "정시 도착"
                                    : landResult.arrivalStatus === "delayed"
                                      ? "연착 도착"
                                      : "중도 포기"}
                            </span>
                        </div>

                        <div className="px-8 py-6">
                            {/* Route */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white tracking-tight leading-none">
                                        {landResult.fromAirport?.iata ?? from}
                                    </p>
                                    <p className="text-[11px] text-white/35 mt-1.5 tracking-wide">
                                        {landResult.fromAirport?.city ?? ""}
                                    </p>
                                </div>

                                <div className="flex-1 flex flex-col items-center gap-1">
                                    <svg
                                        width="100%"
                                        height="20"
                                        viewBox="0 0 120 20"
                                        fill="none"
                                    >
                                        <line
                                            x1="0"
                                            y1="10"
                                            x2="105"
                                            y2="10"
                                            stroke="rgba(255,255,255,0.15)"
                                            strokeWidth="1"
                                            strokeDasharray="4 4"
                                        />
                                        <path
                                            d="M105 10 l-6 -4 l0 8 z"
                                            fill="rgba(255,255,255,0.25)"
                                        />
                                    </svg>
                                    <p className="text-[9px] text-white/20 tracking-widest uppercase">
                                        {formatDistance(landResult.elapsed)}
                                    </p>
                                </div>

                                <div className="text-center">
                                    <p
                                        className={`text-3xl font-bold tracking-tight leading-none ${
                                            landResult.destination
                                                ? "text-white"
                                                : "text-white/30"
                                        }`}
                                    >
                                        {landResult.destination?.iata ?? "---"}
                                    </p>
                                    <p className="text-[11px] text-white/35 mt-1.5 tracking-wide">
                                        {landResult.destination?.city ?? ""}
                                    </p>
                                </div>
                            </div>

                            {/* Destination detail */}
                            {landResult.destination && (
                                <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3.5 mb-5">
                                    <p className="text-[11px] text-white/25 tracking-widest uppercase mb-1">
                                        목적지
                                    </p>
                                    <p className="text-[15px] font-semibold text-white/80 leading-tight">
                                        {landResult.destination.name}
                                    </p>
                                    <p className="text-[12px] text-white/35 mt-0.5">
                                        {landResult.destination.city} ·{" "}
                                        {landResult.destination.country}
                                    </p>
                                </div>
                            )}

                            {/* Stats row */}
                            <div className="flex gap-3 mb-5">
                                <div className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-center">
                                    <p className="text-lg font-bold text-white tabular-nums tracking-tight">
                                        {formatElapsed(landResult.elapsed)}
                                    </p>
                                    <p className="text-[9px] text-white/25 mt-1 tracking-widest uppercase">
                                        비행 시간
                                    </p>
                                </div>
                                {landResult.subject && (
                                    <div className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-center flex items-center justify-center">
                                        <span className="text-[13px] font-medium text-sky-400/80">
                                            {landResult.subject}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* CTA */}
                            <button
                                onClick={() => router.push("/")}
                                className="w-full py-3.5 bg-sky-600/80 hover:bg-sky-500 text-white rounded-2xl font-semibold text-[15px] transition-all duration-150 tracking-wide"
                            >
                                홈으로 돌아가기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top-left: clock */}
            <div
                className={`absolute top-8 left-8 ${showMap ? "z-30" : "z-10"}`}
            >
                <button
                    className="flex items-center gap-3 group"
                    onClick={() => setClockOpen((o) => !o)}
                >
                    <div className="relative">
                        <AnalogClock hour={displayHour} />
                        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/0 group-hover:ring-white/25 transition-all duration-200" />
                    </div>
                    <div className="text-left">
                        <p className="text-2xl font-bold text-white tabular-nums tracking-tight leading-none">
                            {skyClockDisplay(displayHour)}
                        </p>
                        <p className="text-[10px] text-white/35 mt-1 tracking-widest uppercase flex items-center gap-1">
                            {modeLabel}
                            <svg
                                width="8"
                                height="5"
                                viewBox="0 0 8 5"
                                className={`transition-transform duration-200 ${clockOpen ? "rotate-180" : ""}`}
                            >
                                <path
                                    d="M0.5 0.5L4 4L7.5 0.5"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </p>
                    </div>
                </button>

                <div
                    className={`mt-3 transition-all duration-200 origin-top ${
                        clockOpen
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 -translate-y-1 pointer-events-none"
                    }`}
                >
                    <TimeBar
                        indicatorHour={displayHour}
                        mode={timeMode}
                        onDrag={handleBarDrag}
                        onModeChange={handleModeChange}
                    />
                </div>
            </div>

            {/* Top-right: flight stats */}
            <div
                className={`absolute top-8 right-8 ${showMap ? "z-30" : "z-10"}`}
            >
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/8 text-right">
                    {subject && (
                        <p className="text-[10px] text-sky-400/70 tracking-widest uppercase mb-2">
                            {subject}
                        </p>
                    )}
                    {preSelectedDestination && (
                        <div className="mb-2">
                            <p className="text-[10px] text-white/25 tracking-widest uppercase">
                                목적지
                            </p>
                            <p className="text-base font-bold text-white/70 tracking-tight leading-tight mt-0.5">
                                {preSelectedDestination.iata}
                                <span className="text-[11px] font-normal text-white/35 ml-1.5">
                                    {preSelectedDestination.city}
                                </span>
                            </p>
                            <div className="h-px bg-white/8 mt-2 mb-2" />
                        </div>
                    )}
                    <p
                        className={`text-2xl font-bold tabular-nums tracking-tight leading-none ${
                            timerMain.delayed ? "text-amber-400" : "text-white"
                        }`}
                    >
                        {timerMain.value}
                    </p>
                    <p className="text-[10px] text-white/35 mt-0.5 tracking-widest uppercase">
                        {timerMain.label}
                    </p>
                    {mode === "planned" && (
                        <>
                            <div className="h-px bg-white/8 my-2" />
                            <p className="text-sm font-medium text-white/50 tabular-nums tracking-tight leading-none">
                                {formatElapsed(elapsed)}
                            </p>
                            <p className="text-[10px] text-white/25 mt-0.5 tracking-widest uppercase">
                                총 비행 시간
                            </p>
                        </>
                    )}
                    <div className="h-px bg-white/8 my-2" />
                    <p className="text-lg font-semibold text-white/70 tabular-nums tracking-tight leading-none">
                        {formatDistance(elapsed)}
                    </p>
                    <p className="text-[10px] text-white/35 mt-0.5 tracking-widest uppercase">
                        비행 거리
                    </p>
                </div>
            </div>

            {/* Right: controls pill */}
            <div
                className={`absolute right-8 top-1/2 -translate-y-1/2 ${showMap ? "z-30" : "z-10"}`}
            >
                <div className="bg-black/20 backdrop-blur-md rounded-2xl flex flex-col divide-y divide-white/8">
                    {/* Music / mute toggle */}
                    <div className="relative group">
                        <button
                            className={`${btnCls} rounded-t-2xl`}
                            onClick={() => setMuted((m) => !m)}
                        >
                            {muted ? (
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
                                    strokeOpacity="0.65"
                                >
                                    <path d="M9 18V5l12-2v13" />
                                    <circle cx="6" cy="18" r="3" />
                                    <circle cx="18" cy="16" r="3" />
                                </svg>
                            )}
                        </button>
                        <LeftTooltip label={muted ? "음소거 해제" : "음소거"} />
                    </div>
                    {/* Globe / Window toggle */}
                    <div className="relative group">
                        <button
                            className={btnCls}
                            onClick={() => setShowMap((s) => !s)}
                        >
                            {showMap ? (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeOpacity="0.65"
                                >
                                    <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="18"
                                        rx="4"
                                    />
                                    <path d="M3 9h18M9 9v12" />
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
                                    strokeOpacity="0.65"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                            )}
                        </button>
                        <LeftTooltip label={showMap ? "창문 뷰" : "지도"} />
                    </div>
                    {/* Pause / Play */}
                    <div className="relative group">
                        <button
                            className={`${btnCls} ${showMap ? "rounded-b-2xl" : ""}`}
                            onClick={() => setRunning((r) => !r)}
                        >
                            {running ? (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                    fillOpacity="0.65"
                                >
                                    <rect
                                        x="6"
                                        y="4"
                                        width="4"
                                        height="16"
                                        rx="1"
                                    />
                                    <rect
                                        x="14"
                                        y="4"
                                        width="4"
                                        height="16"
                                        rx="1"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                    fillOpacity="0.65"
                                >
                                    <polygon points="5,3 19,12 5,21" />
                                </svg>
                            )}
                        </button>
                        <LeftTooltip label={running ? "일시정지" : "재생"} />
                    </div>
                    {/* Cabin light */}
                    {!showMap && (
                        <div className="relative group">
                            <button
                                className={`${btnCls} rounded-b-2xl`}
                                onClick={() => setCabinOpen((o) => !o)}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={
                                        cabinMode === "on"
                                            ? "#fbbf24"
                                            : cabinMode === "auto"
                                              ? "#7dd3fc"
                                              : "white"
                                    }
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeOpacity={
                                        cabinMode === "off" ? 0.3 : 0.85
                                    }
                                >
                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                                    <path d="M9 18h6" />
                                    <path d="M10 22h4" />
                                </svg>
                            </button>
                            {!cabinOpen && (
                                <LeftTooltip
                                    label={
                                        cabinMode === "on"
                                            ? "캐빈 조명: 켜짐"
                                            : cabinMode === "auto"
                                              ? "캐빈 조명: 자동"
                                              : "캐빈 조명: 꺼짐"
                                    }
                                />
                            )}
                            <div
                                className={`absolute right-full top-1/2 -translate-y-1/2 mr-3 flex flex-row gap-2 transition-all duration-200 ease-out ${
                                    cabinOpen
                                        ? "translate-x-0 opacity-100"
                                        : "translate-x-4 opacity-0 pointer-events-none"
                                }`}
                            >
                                <button
                                    onClick={() => {
                                        setCabinMode("on");
                                        setCabinOpen(false);
                                    }}
                                    className={`w-12 h-12 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all ${
                                        cabinMode === "on"
                                            ? "bg-amber-400/25 ring-1 ring-amber-400/50 text-amber-300"
                                            : "bg-white/8 text-white/30 hover:bg-white/12 hover:text-white/55"
                                    }`}
                                >
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="4"
                                            fill="currentColor"
                                            stroke="none"
                                        />
                                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                                    </svg>
                                    <span className="text-[8px] font-bold tracking-wider">
                                        ON
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        setCabinMode("auto");
                                        setCabinOpen(false);
                                    }}
                                    className={`w-12 h-12 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all ${
                                        cabinMode === "auto"
                                            ? "bg-sky-400/20 ring-1 ring-sky-400/40 text-sky-200"
                                            : "bg-white/8 text-white/30 hover:bg-white/12 hover:text-white/55"
                                    }`}
                                >
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        stroke="none"
                                    >
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                    <span className="text-[8px] font-bold tracking-wider">
                                        AUTO
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        setCabinMode("off");
                                        setCabinOpen(false);
                                    }}
                                    className={`w-12 h-12 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all ${
                                        cabinMode === "off"
                                            ? "bg-white/12 ring-1 ring-white/20 text-white/55"
                                            : "bg-white/8 text-white/30 hover:bg-white/12 hover:text-white/55"
                                    }`}
                                >
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    >
                                        <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                                        <line x1="12" y1="2" x2="12" y2="12" />
                                    </svg>
                                    <span className="text-[8px] font-bold tracking-wider">
                                        OFF
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
