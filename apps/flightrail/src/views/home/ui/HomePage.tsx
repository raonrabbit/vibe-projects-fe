"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { findDestinationCandidates } from "@/entities/airport";
import { DurationPicker } from "@/shared/ui/DurationPicker";
import { LandingIcon, PlaneIcon } from "@/shared/ui/icons";
import { AppHeader } from "@/widgets/app-header";
import { CandidateList } from "@/widgets/candidate-list";
import { DepartureMap } from "@/widgets/departure-map";
import { RouteBar } from "@/widgets/route-bar";

export default function HomePage() {
    const router = useRouter();
    const [tab, setTab] = useState<"new" | "active">("new");
    const [from, setFrom] = useState("ICN");
    const [to, setTo] = useState<string | null>(null);
    const [hours, setHours] = useState(2);
    const [minutes, setMinutes] = useState(0);
    const [subject, setSubject] = useState("");
    const [hardStop, setHardStop] = useState(false);

    const durationSeconds = hours * 3600 + minutes * 60;
    const candidates =
        durationSeconds > 0
            ? findDestinationCandidates(from, durationSeconds)
            : [];
    const candidateAirports = candidates.map((c) => c.airport);
    const canDepart = to !== null && durationSeconds > 0;

    const todayFull = new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    function handleDepart() {
        if (!canDepart || !to) return;
        const params = new URLSearchParams({
            subject,
            from,
            to,
            duration: String(durationSeconds),
            hardStop: String(hardStop),
        });
        router.push(`/timer?${params}`);
    }

    return (
        <main className="relative w-full min-h-screen bg-fr-base flex flex-col">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fr-surface via-fr-base to-fr-deep" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-10%,rgba(56,189,248,0.05),transparent)]" />

            {/* Header */}
            <AppHeader active="home" />

            {/* Main */}
            <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 pt-6 pb-10">
                <p className="text-[9px] text-white/18 tracking-[0.5em] uppercase mb-6">
                    Ready for Takeoff
                </p>

                <div className="w-full max-w-3xl">
                    {/* Tab bar */}
                    <div className="flex items-center border-b border-white/[0.07]">
                        {(["new", "active"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-5 py-3 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                                    tab === t
                                        ? "text-white border-sky-500"
                                        : "text-white/28 border-transparent hover:text-white/50"
                                }`}
                            >
                                {t === "new" ? "새 여행" : "진행중인 여행"}
                            </button>
                        ))}
                        <div className="flex-1" />
                        <span className="hidden sm:inline text-[11px] text-white/18 pb-3 pr-1">
                            {todayFull}
                        </span>
                    </div>

                    {/* Card */}
                    <div className="bg-fr-overlay/60 backdrop-blur-sm border border-t-0 border-white/[0.07] rounded-b-3xl rounded-tr-3xl">
                        {tab === "active" ? (
                            <div className="flex flex-col items-center justify-center py-14 gap-4 px-6">
                                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/25">
                                    <PlaneIcon size={22} />
                                </div>
                                <p className="text-[13px] text-white/35">
                                    진행중인 여행이 없습니다
                                </p>
                                <Link
                                    href="/timer"
                                    className="px-5 py-2.5 text-[13px] text-white/50 hover:text-white/80 border border-white/[0.08] hover:border-white/20 rounded-xl transition-colors"
                                >
                                    타이머로 이동
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {/* ① Route bar */}
                                <div className="px-5 sm:px-8 pt-6 sm:pt-7 pb-5 border-b border-white/[0.05]">
                                    <RouteBar
                                        from={from}
                                        to={to}
                                        onFrom={(v) => {
                                            setFrom(v);
                                            setTo(null);
                                        }}
                                    />
                                </div>

                                {/* ② Duration + Candidates */}
                                <div className="px-5 sm:px-8 py-5 border-b border-white/[0.05] bg-white/[0.015]">
                                    <p className="text-[9px] text-white/28 tracking-widest uppercase mb-4">
                                        비행 시간
                                    </p>
                                    <DurationPicker
                                        hours={hours}
                                        minutes={minutes}
                                        onHours={setHours}
                                        onMinutes={setMinutes}
                                    />
                                    <CandidateList
                                        candidates={candidates}
                                        selected={to}
                                        keyPrefix={`${from}-${hours}-${minutes}`}
                                        onSelect={setTo}
                                    />
                                    {candidates.length === 0 &&
                                        durationSeconds === 0 && (
                                            <p className="text-[12px] text-white/20 mt-2">
                                                시간을 설정하면 목적지 후보가
                                                표시됩니다
                                            </p>
                                        )}
                                </div>

                                {/* ③ Subject */}
                                <div className="px-5 sm:px-8 py-5 border-b border-white/[0.05]">
                                    <p className="text-[9px] text-white/28 tracking-widest uppercase mb-3">
                                        여행 목적
                                    </p>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) =>
                                            setSubject(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && handleDepart()
                                        }
                                        placeholder="무엇을 공부할 예정인가요?"
                                        className="w-full bg-transparent text-white placeholder:text-white/18 text-[15px] sm:text-[16px] outline-none"
                                    />
                                    <div className="flex gap-1.5 mt-3 flex-wrap">
                                        {[
                                            "알고리즘",
                                            "영어",
                                            "수학",
                                            "프로그래밍",
                                            "독서",
                                        ].map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() =>
                                                    setSubject(
                                                        subject === tag
                                                            ? ""
                                                            : tag,
                                                    )
                                                }
                                                className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${
                                                    subject === tag
                                                        ? "border-sky-500/60 bg-sky-500/10 text-sky-400"
                                                        : "border-white/[0.07] text-white/25 hover:text-white/50 hover:border-white/15 active:bg-white/5"
                                                }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ④ Map */}
                                <div className="px-5 sm:px-8 py-5 border-b border-white/[0.05]">
                                    <DepartureMap
                                        from={from}
                                        to={to}
                                        candidates={candidateAirports}
                                        onSelectCandidate={setTo}
                                    />
                                </div>

                                {/* ⑤ Landing option + Book */}
                                <div className="px-5 sm:px-8 py-5 sm:py-6">
                                    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                                        <div className="flex-1">
                                            <p className="text-[9px] text-white/28 tracking-widest uppercase mb-3">
                                                착륙 옵션
                                            </p>
                                            <div className="flex gap-2">
                                                {(
                                                    [
                                                        {
                                                            v: false,
                                                            label: "계속 비행",
                                                            desc: "목표 시간 후에도 타이머가 계속 실행됩니다. 직접 착륙을 선택해야 기록됩니다.",
                                                            icon: (
                                                                <PlaneIcon
                                                                    size={12}
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            v: true,
                                                            label: "자동 착륙",
                                                            desc: "목표 시간이 되면 자동으로 세션이 종료되고 기록됩니다.",
                                                            icon: (
                                                                <LandingIcon
                                                                    size={12}
                                                                />
                                                            ),
                                                        },
                                                    ] as const
                                                ).map(
                                                    ({
                                                        v,
                                                        label,
                                                        desc,
                                                        icon,
                                                    }) => (
                                                        <button
                                                            key={String(v)}
                                                            onClick={() =>
                                                                setHardStop(v)
                                                            }
                                                            className={`flex-1 flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                                                                hardStop === v
                                                                    ? "border-sky-500/45 bg-sky-500/7 text-white"
                                                                    : "border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/12"
                                                            }`}
                                                        >
                                                            <span
                                                                className={`mt-0.5 shrink-0 ${hardStop === v ? "text-sky-400" : "text-white/28"}`}
                                                            >
                                                                {icon}
                                                            </span>
                                                            <div>
                                                                <p className="text-[12px] font-medium leading-none mb-1.5">
                                                                    {label}
                                                                </p>
                                                                <p
                                                                    className={`text-[10px] leading-relaxed ${hardStop === v ? "text-white/40" : "text-white/22"}`}
                                                                >
                                                                    {desc}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleDepart}
                                            disabled={!canDepart}
                                            className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 sm:py-5 rounded-2xl font-semibold text-[14px] transition-all duration-200 tracking-wide shrink-0 ${
                                                canDepart
                                                    ? "bg-fr-sky-deep hover:bg-fr-sky-deep/90 active:bg-fr-sky-deep text-white shadow-lg shadow-black/40"
                                                    : "bg-white/4 text-white/18 cursor-not-allowed"
                                            }`}
                                        >
                                            <PlaneIcon size={18} />
                                            <span>예매하기</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
