"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { AIRPORTS, findDestinationCandidates } from "@/entities/airport";

type Mode = "free" | "planned";

type Step = "mode" | "subject" | "airport" | "duration" | "destination";

interface DepartureModalProps {
    onClose: () => void;
}

export default function DepartureModal({ onClose }: DepartureModalProps) {
    const router = useRouter();
    const [step, setStep] = useState<Step>("mode");
    const [mode, setMode] = useState<Mode | null>(null);
    const [subject, setSubject] = useState("");
    const [airport, setAirport] = useState("ICN");
    const [airportSearch, setAirportSearch] = useState("");
    const [hours, setHours] = useState(2);
    const [minutes, setMinutes] = useState(0);
    const [hoursText, setHoursText] = useState<string | null>(null);
    const [minutesText, setMinutesText] = useState<string | null>(null);
    const [destination, setDestination] = useState<string>("");

    const steps: Step[] = [
        "mode",
        "subject",
        "airport",
        ...(mode === "planned" ? (["duration", "destination"] as Step[]) : []),
    ];

    const destinationCandidates = useMemo(() => {
        if (mode !== "planned") return [];
        const totalSec = hours * 3600 + minutes * 60;
        if (totalSec === 0) return [];
        return findDestinationCandidates(airport, totalSec);
    }, [mode, airport, hours, minutes]);
    const stepIndex = steps.indexOf(step);
    const isLast = stepIndex === steps.length - 1;

    const filteredAirports = AIRPORTS.filter(
        (a) =>
            a.iata.includes(airportSearch.toUpperCase()) ||
            a.name.includes(airportSearch) ||
            a.city.includes(airportSearch),
    );

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
            mode: mode ?? "free",
            subject,
            from: airport,
        });
        if (mode === "planned") {
            params.set("duration", String(hours * 3600 + minutes * 60));
            params.set("to", destination);
        }
        router.push(`/timer?${params}`);
    }

    const canProceed =
        (step === "mode" && mode !== null) ||
        step === "subject" ||
        step === "airport" ||
        step === "duration" ||
        (step === "destination" && destination !== "");

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-[480px] bg-[#111210] border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-7 pb-5">
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

                {/* Content */}
                <div className="px-8 pb-8">
                    {/* Step: Mode */}
                    {step === "mode" && (
                        <div>
                            <h2 className="text-[22px] font-bold text-white mb-1.5">
                                어떤 여행을 떠나시나요?
                            </h2>
                            <p className="text-[13px] text-white/40 mb-6">
                                여행 방식을 선택하세요
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {(
                                    [
                                        {
                                            value: "free" as Mode,
                                            icon: (
                                                <svg
                                                    width="28"
                                                    height="28"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                >
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                    />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                            ),
                                            label: "자유 여행",
                                            desc: "목표 없이 자유롭게",
                                            sub: "스톱워치",
                                        },
                                        {
                                            value: "planned" as Mode,
                                            icon: (
                                                <svg
                                                    width="28"
                                                    height="28"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                >
                                                    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                                </svg>
                                            ),
                                            label: "정해진 여행",
                                            desc: "목표 시간을 정하고",
                                            sub: "카운트다운",
                                        },
                                    ] as const
                                ).map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setMode(opt.value)}
                                        className={`flex flex-col gap-3 p-5 rounded-2xl border text-left transition-all duration-150 ${
                                            mode === opt.value
                                                ? "border-sky-500/60 bg-sky-500/10 text-white"
                                                : "border-white/[0.07] bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white/80"
                                        }`}
                                    >
                                        <span
                                            className={
                                                mode === opt.value
                                                    ? "text-sky-400"
                                                    : ""
                                            }
                                        >
                                            {opt.icon}
                                        </span>
                                        <div>
                                            <p className="font-semibold text-[15px] leading-tight">
                                                {opt.label}
                                            </p>
                                            <p className="text-[12px] mt-0.5 opacity-60">
                                                {opt.desc}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full w-fit ${
                                                mode === opt.value
                                                    ? "bg-sky-500/20 text-sky-400"
                                                    : "bg-white/8 text-white/40"
                                            }`}
                                        >
                                            {opt.sub}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step: Subject */}
                    {step === "subject" && (
                        <div>
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
                        <div>
                            <h2 className="text-[22px] font-bold text-white mb-1.5">
                                출발지를 선택하세요
                            </h2>
                            <p className="text-[13px] text-white/40 mb-4">
                                공항을 검색하거나 선택하세요
                            </p>
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
                            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                                {filteredAirports.map((a) => (
                                    <button
                                        key={a.iata}
                                        onClick={() => setAirport(a.iata)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                                            airport === a.iata
                                                ? "border-sky-500/50 bg-sky-500/10"
                                                : "border-transparent hover:bg-white/5"
                                        }`}
                                    >
                                        <div>
                                            <span
                                                className={`font-bold text-[15px] mr-2 ${airport === a.iata ? "text-sky-400" : "text-white"}`}
                                            >
                                                {a.iata}
                                            </span>
                                            <span className="text-[13px] text-white/50">
                                                {a.city}
                                            </span>
                                        </div>
                                        <span className="text-[12px] text-white/30">
                                            {a.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step: Duration (planned only) */}
                    {step === "duration" && (
                        <div>
                            <h2 className="text-[22px] font-bold text-white mb-1.5">
                                목표 비행 시간
                            </h2>
                            <p className="text-[13px] text-white/40 mb-8">
                                공부할 목표 시간을 설정하세요
                            </p>
                            <div className="flex items-center justify-center gap-6">
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
                        </div>
                    )}

                    {/* Step: Destination (planned only) */}
                    {step === "destination" && (
                        <div>
                            <h2 className="text-[22px] font-bold text-white mb-1">
                                목적지를 선택하세요
                            </h2>
                            <p className="text-[13px] text-white/40 mb-4">
                                {hours}시간{minutes > 0 ? ` ${minutes}분` : ""}{" "}
                                기준 ±30분 후보
                            </p>
                            {destinationCandidates.length === 0 ? (
                                <p className="text-white/30 text-[13px] text-center py-6">
                                    해당 시간대 후보 공항이 없습니다
                                </p>
                            ) : (
                                <div className="max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/[0.15] [&::-webkit-scrollbar-thumb:hover]:bg-white/30">
                                    <div className="grid grid-cols-2 gap-2 pr-2">
                                        {[...destinationCandidates]
                                            .sort((a, b) =>
                                                a.airport.country.localeCompare(
                                                    b.airport.country,
                                                    "ko",
                                                ),
                                            )
                                            .map(
                                                ({
                                                    airport: a,
                                                    distKm,
                                                    flightMinutes,
                                                }) => {
                                                    const fh = Math.floor(
                                                        flightMinutes / 60,
                                                    );
                                                    const fm =
                                                        flightMinutes % 60;
                                                    const timeStr =
                                                        fh > 0
                                                            ? `${fh}h${fm > 0 ? ` ${fm}m` : ""}`
                                                            : `${fm}m`;
                                                    const selected =
                                                        destination === a.iata;
                                                    return (
                                                        <button
                                                            key={a.iata}
                                                            onClick={() =>
                                                                setDestination(
                                                                    a.iata,
                                                                )
                                                            }
                                                            className={`flex flex-col p-4 rounded-2xl border text-left transition-all duration-150 ${
                                                                selected
                                                                    ? "border-sky-500/50 bg-sky-500/10"
                                                                    : "border-white/[0.07] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between mb-2">
                                                                <span
                                                                    className={`text-[22px] font-bold tracking-tight leading-none ${selected ? "text-sky-400" : "text-white"}`}
                                                                >
                                                                    {a.iata}
                                                                </span>
                                                                <span
                                                                    className={`text-[11px] font-semibold tabular-nums mt-0.5 ${selected ? "text-sky-400/80" : "text-white/35"}`}
                                                                >
                                                                    ≈ {timeStr}
                                                                </span>
                                                            </div>
                                                            <p className="text-[12px] text-white/60 leading-tight">
                                                                {a.city}
                                                            </p>
                                                            <p className="text-[11px] text-white/30 leading-tight mt-0.5">
                                                                {a.country}
                                                            </p>
                                                            <p
                                                                className={`text-[10px] mt-1.5 tabular-nums ${selected ? "text-sky-500/50" : "text-white/20"}`}
                                                            >
                                                                {distKm.toLocaleString()}{" "}
                                                                km
                                                            </p>
                                                        </button>
                                                    );
                                                },
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer buttons */}
                    <div className="flex gap-3 mt-8">
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
        </div>
    );
}
