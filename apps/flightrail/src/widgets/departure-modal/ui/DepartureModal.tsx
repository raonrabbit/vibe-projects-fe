"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AIRPORTS, findDestinationCandidates } from "@/entities/airport";
import type { Airport, AirportCandidate } from "@/entities/airport";
import { createWorldMapProjection, drawWorldMap } from "@/shared/lib/mapUtils";

type Step = "subject" | "airport" | "duration" | "hard_stop";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function SplitFlapText({
    value,
    className,
}: {
    value: string;
    className?: string;
}) {
    const [display, setDisplay] = useState(() =>
        Array.from(
            { length: value.length },
            () => CHARS[Math.floor(Math.random() * CHARS.length)],
        ).join(""),
    );
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        let frame = 0;
        const FRAMES_PER_CHAR = 5;
        const total = value.length * FRAMES_PER_CHAR + 4;
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            const settled = Math.floor(frame / FRAMES_PER_CHAR);
            setDisplay(
                Array.from({ length: value.length }, (_, i) =>
                    i < settled
                        ? value[i]
                        : CHARS[Math.floor(Math.random() * CHARS.length)],
                ).join(""),
            );
            frame++;
            if (frame > total) {
                setDisplay(value);
                if (timerRef.current) clearInterval(timerRef.current);
            }
        }, 45);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [value]);

    return <span className={className}>{display}</span>;
}

function WorldMapMini({
    selectedLat,
    selectedLng,
    candidates,
}: {
    selectedLat: number;
    selectedLng: number;
    candidates?: AirportCandidate[];
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        let cancelled = false;

        drawWorldMap(canvas)
            .then(() => {
                if (cancelled) return;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                const { width, height } = canvas;
                const proj = createWorldMapProjection(width, height);

                // 모든 공항 점
                for (const a of AIRPORTS) {
                    const p = proj([a.lng, a.lat]);
                    if (!p) continue;
                    ctx.beginPath();
                    ctx.arc(p[0], p[1], 1.8, 0, Math.PI * 2);
                    ctx.fillStyle = "rgba(255,255,255,0.22)";
                    ctx.fill();
                }

                // 목적지 후보
                if (candidates) {
                    for (const { airport: a } of candidates) {
                        const p = proj([a.lng, a.lat]);
                        if (!p) continue;
                        ctx.beginPath();
                        ctx.arc(p[0], p[1], 7, 0, Math.PI * 2);
                        ctx.fillStyle = "rgba(251,191,36,0.12)";
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2);
                        ctx.fillStyle = "rgba(251,191,36,0.8)";
                        ctx.fill();
                    }
                }

                // 선택된 출발 공항
                const sp = proj([selectedLng, selectedLat]);
                if (sp) {
                    ctx.beginPath();
                    ctx.arc(sp[0], sp[1], 14, 0, Math.PI * 2);
                    ctx.fillStyle = "rgba(56,189,248,0.08)";
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(sp[0], sp[1], 7, 0, Math.PI * 2);
                    ctx.fillStyle = "rgba(56,189,248,0.22)";
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(sp[0], sp[1], 3.5, 0, Math.PI * 2);
                    ctx.fillStyle = "rgba(56,189,248,1)";
                    ctx.fill();
                }
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [selectedLat, selectedLng, candidates]);

    return (
        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/[0.05] mb-4 bg-[#0c1a2e]">
            <canvas
                ref={canvasRef}
                width={900}
                height={450}
                className="w-full h-full"
            />
        </div>
    );
}

function FlipCard({
    airport,
    selected,
    onClick,
    index,
}: {
    airport: Airport;
    selected: boolean;
    onClick: () => void;
    index: number;
}) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const id = setTimeout(() => setVisible(true), Math.min(index, 20) * 28);
        return () => clearTimeout(id);
    }, []);

    return (
        <button
            onClick={onClick}
            style={{
                transition: "transform 0.22s ease-out, opacity 0.22s ease-out",
                transitionDelay: `${Math.min(index, 20) * 22}ms`,
                transform: visible
                    ? "perspective(300px) rotateX(0deg)"
                    : "perspective(300px) rotateX(-65deg)",
                opacity: visible ? 1 : 0,
                transformOrigin: "top center",
            }}
            className={`flex flex-col items-center py-3 px-2 rounded-xl border text-center ${
                selected
                    ? "border-sky-500/50 bg-sky-500/10"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/5 hover:border-white/15"
            }`}
        >
            <span
                className={`text-[14px] font-bold tracking-wider font-mono ${
                    selected ? "text-sky-400" : "text-white"
                }`}
            >
                {airport.iata}
            </span>
            <p className="text-[9px] text-white/35 mt-0.5 truncate w-full leading-tight">
                {airport.city}
            </p>
        </button>
    );
}

function DestinationCard({
    candidate,
    index,
}: {
    candidate: AirportCandidate;
    index: number;
}) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const id = setTimeout(() => setVisible(true), index * 38);
        return () => clearTimeout(id);
    }, []);

    return (
        <div
            style={{
                transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
                transitionDelay: `${index * 32}ms`,
                transform: visible
                    ? "perspective(300px) rotateX(0deg)"
                    : "perspective(300px) rotateX(-70deg)",
                opacity: visible ? 1 : 0,
                transformOrigin: "top center",
            }}
            className="flex flex-col items-center py-3 px-2 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center"
        >
            <SplitFlapText
                value={candidate.airport.iata}
                className="text-[14px] font-bold tracking-wider font-mono text-amber-400/80"
            />
            <p className="text-[9px] text-white/30 mt-0.5 truncate w-full leading-tight">
                {candidate.airport.city}
            </p>
            <p className="text-[8px] text-white/20 mt-0.5 tabular-nums">
                {candidate.flightMinutes}min
            </p>
        </div>
    );
}

interface DepartureModalProps {
    onClose: () => void;
}

export default function DepartureModal({ onClose }: DepartureModalProps) {
    const router = useRouter();
    const [flightNum] = useState(
        () => `FR-${String(Math.floor(Math.random() * 900) + 100)}`,
    );
    const [step, setStep] = useState<Step>("subject");
    const [subject, setSubject] = useState("");
    const [airport, setAirport] = useState("ICN");
    const [airportSearch, setAirportSearch] = useState("");
    const [hours, setHours] = useState(2);
    const [minutes, setMinutes] = useState(0);
    const [hoursText, setHoursText] = useState<string | null>(null);
    const [minutesText, setMinutesText] = useState<string | null>(null);
    const [hardStop, setHardStop] = useState(false);

    const steps: Step[] = ["subject", "airport", "duration", "hard_stop"];
    const stepIndex = steps.indexOf(step);
    const isLast = stepIndex === steps.length - 1;

    const filteredAirports = AIRPORTS.filter(
        (a) =>
            a.iata.includes(airportSearch.toUpperCase()) ||
            a.name.includes(airportSearch) ||
            a.city.includes(airportSearch),
    );

    const selectedAirportData = AIRPORTS.find((a) => a.iata === airport);
    const durationSeconds = hours * 3600 + minutes * 60;
    const destinationCandidates =
        durationSeconds > 0
            ? findDestinationCandidates(airport, durationSeconds).slice(0, 8)
            : [];

    function next() {
        if (isLast) {
            board();
            return;
        }
        setStep(steps[stepIndex + 1]);
    }

    function back() {
        if (stepIndex === 0) {
            onClose();
            return;
        }
        setStep(steps[stepIndex - 1]);
    }

    function board() {
        const params = new URLSearchParams({
            subject,
            from: airport,
            duration: String(durationSeconds),
            hardStop: String(hardStop),
        });
        router.push(`/timer?${params}`);
    }

    const canProceed =
        step === "subject" ||
        step === "airport" ||
        (step === "duration" && durationSeconds > 0) ||
        step === "hard_stop";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-[560px] max-w-[95vw] max-h-[90vh] flex flex-col bg-[#111210] border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between px-8 pt-7 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            {steps.map((s, i) => (
                                <div
                                    key={s}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        i <= stepIndex
                                            ? "bg-sky-500 w-6"
                                            : "bg-white/15 w-4"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-[9px] text-white/20 tracking-[0.25em] uppercase">
                            {flightNum}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 transition-colors text-white/40 hover:text-white/70"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            <path d="M1 1l12 12M13 1L1 13" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-8">
                    {/* Step: Subject */}
                    {step === "subject" && (
                        <div className="pb-2">
                            <h2 className="text-[22px] font-bold text-white mb-1.5">
                                무엇을 공부하나요?
                            </h2>
                            <p className="text-[13px] text-white/40 mb-6">
                                주제 태그를 입력하세요 (선택사항)
                            </p>
                            <input
                                autoFocus
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && next()}
                                placeholder="예: 알고리즘, 영어, 수학..."
                                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-white placeholder:text-white/25 text-[15px] outline-none focus:border-sky-500/40 transition-colors"
                            />
                            <div className="flex gap-2 mt-4 flex-wrap">
                                {[
                                    "알고리즘",
                                    "영어",
                                    "수학",
                                    "프로그래밍",
                                    "독서",
                                ].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSubject(tag)}
                                        className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors ${
                                            subject === tag
                                                ? "border-sky-500/60 bg-sky-500/10 text-sky-400"
                                                : "border-white/[0.07] bg-white/[0.03] text-white/40 hover:text-white/70"
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step: Airport */}
                    {step === "airport" && (
                        <div className="pb-2">
                            <h2 className="text-[22px] font-bold text-white mb-1.5">
                                출발지를 선택하세요
                            </h2>
                            <p className="text-[13px] text-white/40 mb-4">
                                공항을 검색하거나 선택하세요
                            </p>

                            {selectedAirportData && (
                                <WorldMapMini
                                    selectedLat={selectedAirportData.lat}
                                    selectedLng={selectedAirportData.lng}
                                />
                            )}

                            {/* Selected airport display */}
                            <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl px-5 py-3 mb-3">
                                <SplitFlapText
                                    value={airport}
                                    className="text-[26px] font-bold text-white tracking-[0.2em] font-mono tabular-nums"
                                />
                                <div className="min-w-0">
                                    <p className="text-[12px] text-white/55 leading-tight truncate">
                                        {selectedAirportData?.name ?? ""}
                                    </p>
                                    <p className="text-[10px] text-white/25 mt-0.5">
                                        {selectedAirportData?.city} ·{" "}
                                        {selectedAirportData?.country}
                                    </p>
                                </div>
                            </div>

                            <input
                                autoFocus
                                type="text"
                                value={airportSearch}
                                onChange={(e) =>
                                    setAirportSearch(e.target.value)
                                }
                                placeholder="공항명, 도시, IATA 코드..."
                                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-[13px] outline-none focus:border-sky-500/40 transition-colors mb-3"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-0.5">
                                {filteredAirports.map((a, i) => (
                                    <FlipCard
                                        key={a.iata}
                                        airport={a}
                                        selected={airport === a.iata}
                                        onClick={() => setAirport(a.iata)}
                                        index={i}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step: Duration */}
                    {step === "duration" && (
                        <div className="pb-2">
                            <h2 className="text-[22px] font-bold text-white mb-1.5">
                                비행 계획
                            </h2>
                            <p className="text-[13px] text-white/40 mb-6">
                                이번 비행의 목표 시간을 설정하세요
                            </p>

                            <div className="flex items-center justify-center gap-6 mb-7">
                                {/* Hours */}
                                <div className="flex flex-col items-center gap-3">
                                    <button
                                        onClick={() => {
                                            const cur =
                                                hoursText !== null
                                                    ? parseInt(hoursText, 10) ||
                                                      0
                                                    : hours;
                                            setHours(Math.min(cur + 1, 23));
                                            setHoursText(null);
                                        }}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/12 text-white/60 hover:text-white transition-colors"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        >
                                            <path d="M18 15l-6-6-6 6" />
                                        </svg>
                                    </button>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={
                                            hoursText ??
                                            String(hours).padStart(2, "0")
                                        }
                                        onChange={(e) =>
                                            setHoursText(
                                                e.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 2),
                                            )
                                        }
                                        onFocus={(e) => e.target.select()}
                                        onBlur={() => {
                                            const n = parseInt(
                                                hoursText ?? "",
                                                10,
                                            );
                                            setHours(
                                                isNaN(n)
                                                    ? 0
                                                    : Math.min(
                                                          23,
                                                          Math.max(0, n),
                                                      ),
                                            );
                                            setHoursText(null);
                                        }}
                                        className="w-20 h-20 text-center text-4xl font-bold text-white tabular-nums bg-white/[0.04] border border-white/[0.08] rounded-2xl outline-none focus:border-sky-500/40 transition-colors caret-sky-400"
                                    />
                                    <button
                                        onClick={() => {
                                            const cur =
                                                hoursText !== null
                                                    ? parseInt(hoursText, 10) ||
                                                      0
                                                    : hours;
                                            setHours(Math.max(cur - 1, 0));
                                            setHoursText(null);
                                        }}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/12 text-white/60 hover:text-white transition-colors"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        >
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </button>
                                    <span className="text-[11px] text-white/30 tracking-widest uppercase">
                                        시간
                                    </span>
                                </div>

                                <span className="text-3xl font-bold text-white/20 mb-8">
                                    :
                                </span>

                                {/* Minutes */}
                                <div className="flex flex-col items-center gap-3">
                                    <button
                                        onClick={() => {
                                            const cur =
                                                minutesText !== null
                                                    ? parseInt(
                                                          minutesText,
                                                          10,
                                                      ) || 0
                                                    : minutes;
                                            setMinutes((cur + 1) % 60);
                                            setMinutesText(null);
                                        }}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/12 text-white/60 hover:text-white transition-colors"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        >
                                            <path d="M18 15l-6-6-6 6" />
                                        </svg>
                                    </button>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={
                                            minutesText ??
                                            String(minutes).padStart(2, "0")
                                        }
                                        onChange={(e) =>
                                            setMinutesText(
                                                e.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 2),
                                            )
                                        }
                                        onFocus={(e) => e.target.select()}
                                        onBlur={() => {
                                            const n = parseInt(
                                                minutesText ?? "",
                                                10,
                                            );
                                            setMinutes(
                                                isNaN(n)
                                                    ? 0
                                                    : Math.min(
                                                          59,
                                                          Math.max(0, n),
                                                      ),
                                            );
                                            setMinutesText(null);
                                        }}
                                        className="w-20 h-20 text-center text-4xl font-bold text-white tabular-nums bg-white/[0.04] border border-white/[0.08] rounded-2xl outline-none focus:border-sky-500/40 transition-colors caret-sky-400"
                                    />
                                    <button
                                        onClick={() => {
                                            const cur =
                                                minutesText !== null
                                                    ? parseInt(
                                                          minutesText,
                                                          10,
                                                      ) || 0
                                                    : minutes;
                                            setMinutes((cur - 1 + 60) % 60);
                                            setMinutesText(null);
                                        }}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/12 text-white/60 hover:text-white transition-colors"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        >
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </button>
                                    <span className="text-[11px] text-white/30 tracking-widest uppercase">
                                        분
                                    </span>
                                </div>
                            </div>

                            {/* Destination candidates */}
                            {destinationCandidates.length > 0 && (
                                <div>
                                    {selectedAirportData && (
                                        <WorldMapMini
                                            selectedLat={
                                                selectedAirportData.lat
                                            }
                                            selectedLng={
                                                selectedAirportData.lng
                                            }
                                            candidates={destinationCandidates}
                                        />
                                    )}
                                    <p className="text-[9px] text-white/25 tracking-widest uppercase mb-3">
                                        도달 가능한 공항 · {airport} 출발 ·
                                        ±30분
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                        {destinationCandidates.map((c, i) => (
                                            <DestinationCard
                                                key={`${c.airport.iata}-${durationSeconds}`}
                                                candidate={c}
                                                index={i}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step: Hard Stop */}
                    {step === "hard_stop" && (
                        <div className="pb-2">
                            <h2 className="text-[22px] font-bold text-white mb-1.5">
                                자동 착륙 설정
                            </h2>
                            <p className="text-[13px] text-white/40 mb-6">
                                목표 시간 도달 시 어떻게 할까요?
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setHardStop(false)}
                                    className={`flex flex-col gap-3 p-5 rounded-2xl border text-left transition-all duration-150 ${
                                        !hardStop
                                            ? "border-sky-500/60 bg-sky-500/10 text-white"
                                            : "border-white/[0.07] bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white/80"
                                    }`}
                                >
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        className={
                                            !hardStop ? "text-sky-400" : ""
                                        }
                                    >
                                        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                        <path
                                            d="M5 19l14 0"
                                            strokeDasharray="2 2"
                                            strokeOpacity="0.4"
                                        />
                                    </svg>
                                    <div>
                                        <p className="font-semibold text-[15px] leading-tight">
                                            계속 비행
                                        </p>
                                        <p className="text-[12px] mt-0.5 opacity-60">
                                            목표 후에도 계속 날아요
                                        </p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setHardStop(true)}
                                    className={`flex flex-col gap-3 p-5 rounded-2xl border text-left transition-all duration-150 ${
                                        hardStop
                                            ? "border-sky-500/60 bg-sky-500/10 text-white"
                                            : "border-white/[0.07] bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white/80"
                                    }`}
                                >
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        className={
                                            hardStop ? "text-sky-400" : ""
                                        }
                                    >
                                        <path d="M12 2L12 12" />
                                        <path d="M5 9l7 7 7-7" />
                                        <path d="M3 19h18" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold text-[15px] leading-tight">
                                            자동 착륙
                                        </p>
                                        <p className="text-[12px] mt-0.5 opacity-60">
                                            목표 시간에 딱 맞춰 착륙
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 flex gap-3 px-8 py-6 border-t border-white/[0.05]">
                    <button
                        onClick={back}
                        className="px-5 py-3 rounded-2xl text-white/40 hover:text-white/70 hover:bg-white/5 text-[14px] font-medium transition-colors"
                    >
                        {stepIndex === 0 ? "취소" : "이전"}
                    </button>
                    <button
                        onClick={next}
                        disabled={!canProceed}
                        className={`flex-1 py-3 rounded-2xl text-[15px] font-semibold transition-all duration-150 ${
                            canProceed
                                ? isLast
                                    ? "bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-900/30"
                                    : "bg-white/10 hover:bg-white/15 text-white"
                                : "bg-white/5 text-white/25 cursor-not-allowed"
                        }`}
                    >
                        {isLast ? "탑승 ✈" : "다음"}
                    </button>
                </div>
            </div>
        </div>
    );
}
