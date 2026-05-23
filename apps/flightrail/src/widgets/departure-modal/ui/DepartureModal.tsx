"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "free" | "planned";

const AIRPORTS = [
    { iata: "ICN", name: "인천국제공항", city: "서울" },
    { iata: "GMP", name: "김포국제공항", city: "서울" },
    { iata: "PUS", name: "김해국제공항", city: "부산" },
    { iata: "CJU", name: "제주국제공항", city: "제주" },
    { iata: "NRT", name: "나리타국제공항", city: "도쿄" },
    { iata: "HND", name: "하네다공항", city: "도쿄" },
    { iata: "LAX", name: "로스앤젤레스 국제공항", city: "LA" },
    { iata: "JFK", name: "존F케네디 국제공항", city: "뉴욕" },
    { iata: "LHR", name: "히드로공항", city: "런던" },
    { iata: "CDG", name: "샤를드골공항", city: "파리" },
    { iata: "SIN", name: "창이공항", city: "싱가포르" },
    { iata: "HKG", name: "홍콩국제공항", city: "홍콩" },
    { iata: "SYD", name: "시드니공항", city: "시드니" },
    { iata: "DXB", name: "두바이국제공항", city: "두바이" },
];

type Step = "mode" | "subject" | "airport" | "duration";

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

    const steps: Step[] = [
        "mode",
        "subject",
        "airport",
        ...(mode === "planned" ? (["duration"] as Step[]) : []),
    ];
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
        }
        router.push(`/timer?${params}`);
    }

    const canProceed =
        (step === "mode" && mode !== null) ||
        step === "subject" ||
        step === "airport" ||
        step === "duration";

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
                                <div className="flex flex-col items-center gap-3">
                                    <button
                                        onClick={() =>
                                            setHours((h) => Math.min(h + 1, 23))
                                        }
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
                                    <div className="w-20 h-20 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-2xl">
                                        <span className="text-4xl font-bold text-white tabular-nums">
                                            {String(hours).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setHours((h) => Math.max(h - 1, 0))
                                        }
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
                                <div className="flex flex-col items-center gap-3">
                                    <button
                                        onClick={() =>
                                            setMinutes((m) => (m + 10) % 60)
                                        }
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
                                    <div className="w-20 h-20 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-2xl">
                                        <span className="text-4xl font-bold text-white tabular-nums">
                                            {String(minutes).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setMinutes(
                                                (m) => (m - 10 + 60) % 60,
                                            )
                                        }
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
