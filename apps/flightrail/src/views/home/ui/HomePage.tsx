"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { AIRPORTS, findDestinationCandidates } from "@/entities/airport";
import { DurationPicker } from "@/shared/ui/DurationPicker";
import { LandingIcon, PlaneIcon } from "@/shared/ui/icons";
import { AppHeader } from "@/widgets/app-header";
import { CandidateList } from "@/widgets/candidate-list";
import { DepartureMap } from "@/widgets/departure-map";

type Step = 1 | 2 | 3 | 4;

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function StepDot({
  step,
  isDone,
  isActive,
}: {
  step: Step;
  isDone: boolean;
  isActive: boolean;
}) {
  if (isDone) {
    return (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/70">
        <svg
          width="9"
          height="9"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  if (isActive) {
    return (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-sky-400/70">
        <div className="h-1.5 w-1.5 rounded-full bg-sky-400/80" />
      </div>
    );
  }
  return (
    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/12 text-[10px] font-medium text-white/20">
      {step}
    </div>
  );
}

function AccordionStep({
  step,
  activeStep,
  completedSteps,
  title,
  summary,
  onHeaderClick,
  children,
}: {
  step: Step;
  activeStep: Step;
  completedSteps: Set<Step>;
  title: string;
  summary: string;
  onHeaderClick: () => void;
  children: ReactNode;
}) {
  const isActive = step === activeStep;
  const isDone = completedSteps.has(step) && !isActive;
  const isLocked = !isActive && !isDone;

  return (
    <div className="border-b border-white/[0.05] last:border-0">
      <button
        onClick={onHeaderClick}
        disabled={isLocked || isActive}
        className={`flex w-full items-center gap-3 px-5 py-4 text-left transition-colors sm:px-8 ${
          isDone ? "cursor-pointer hover:bg-white/[0.025]" : "cursor-default"
        } ${isLocked ? "opacity-30" : ""}`}
      >
        <StepDot step={step} isDone={isDone} isActive={isActive} />
        <div className="min-w-0 flex-1">
          <p
            className={`text-[12px] font-medium transition-colors ${
              isActive
                ? "text-white/75"
                : isDone
                  ? "text-white/40"
                  : "text-white/18"
            }`}
          >
            {title}
          </p>
          {isDone && (
            <p className="mt-0.5 truncate text-[11px] text-white/28">
              {summary}
            </p>
          )}
        </div>
        <div
          className={`transition-transform duration-300 ${
            isActive ? "rotate-180" : ""
          } ${isLocked ? "text-white/10" : "text-white/20"}`}
        >
          <ChevronDown />
        </div>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: isActive ? "1fr" : "0fr",
          transition: "grid-template-rows 280ms ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="px-5 pt-1 pb-6 sm:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

function DepartureSelector({
  from,
  onFrom,
}: {
  from: string;
  onFrom: (v: string) => void;
}) {
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");

  const airport = AIRPORTS.find((a) => a.iata === from);
  const q = search.trim().toLowerCase();
  const results = q
    ? AIRPORTS.filter(
        (a) =>
          a.iata.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q),
      )
    : AIRPORTS;

  const grouped = results.reduce<Record<string, typeof AIRPORTS>>((acc, a) => {
    if (!acc[a.country]) acc[a.country] = [];
    acc[a.country].push(a);
    return acc;
  }, {});

  if (searching) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2">
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="도시, 공항, IATA..."
            className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-2.5 text-[14px] text-white transition-colors outline-none placeholder:text-white/20 focus:border-sky-500/35"
          />
          <button
            onClick={() => {
              setSearching(false);
              setSearch("");
            }}
            className="shrink-0 rounded-xl border border-white/[0.06] px-3 py-2.5 text-[12px] text-white/40 transition-colors hover:border-white/12 hover:text-white/70"
          >
            취소
          </button>
        </div>
        <div className="fr-scrollbar max-h-[45vh] space-y-3 overflow-y-auto pr-0.5">
          {Object.entries(grouped).map(([country, airports]) => (
            <div key={country}>
              <p className="mb-1.5 text-[9px] tracking-[0.15em] text-white/28 uppercase">
                {country}
              </p>
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                {airports.map((a) => (
                  <button
                    key={a.iata}
                    onClick={() => {
                      onFrom(a.iata);
                      setSearching(false);
                      setSearch("");
                    }}
                    className={`flex flex-col items-center rounded-xl border px-1 py-3 text-center transition-all ${
                      from === a.iata
                        ? "border-sky-500/50 bg-sky-500/10 text-sky-400"
                        : "border-white/[0.05] bg-white/[0.02] text-white hover:border-white/12 hover:bg-white/5"
                    }`}
                  >
                    <span className="font-mono text-[13px] font-bold tracking-wide">
                      {a.iata}
                    </span>
                    <span className="mt-0.5 w-full truncate px-1 text-[9px] text-white/30">
                      {a.city}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {results.length === 0 && (
            <p className="py-4 text-center text-[13px] text-white/25">
              검색 결과가 없습니다
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setSearching(true)}
      className="group flex w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 text-left transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[40px] leading-none font-bold tracking-tight text-white sm:text-[44px]">
          {from}
        </p>
        <p className="mt-2 truncate text-[11px] text-white/35">
          {airport?.city} · {airport?.name}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 text-white/25 transition-colors group-hover:text-white/55">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        <span className="text-[11px]">변경</span>
      </div>
    </button>
  );
}

type ResumedFlight = {
  from: string;
  to: string | null;
  subject: string;
  duration: number;
  hardStop: boolean;
  elapsed: number;
  savedAt: number;
};

function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

export default function HomePage() {
  const router = useRouter();
  const [tab, setTab] = useState<"new" | "active">("new");
  const [resumedFlight, setResumedFlight] = useState<ResumedFlight | null>(
    null,
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem("flightrail:resumeFlight");
      if (raw) setResumedFlight(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);
  const [from, setFrom] = useState("ICN");
  const [to, setTo] = useState<string | null>(null);
  const [hours, setHours] = useState(2);
  const [minutes, setMinutes] = useState(0);
  const [subject, setSubject] = useState("");
  const [hardStop, setHardStop] = useState(false);
  const [activeStep, setActiveStep] = useState<Step>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());

  const durationSeconds = hours * 3600 + minutes * 60;
  const candidates =
    durationSeconds > 0 ? findDestinationCandidates(from, durationSeconds) : [];
  const candidateAirports = candidates.map((c) => c.airport);
  const canDepart = to !== null && durationSeconds > 0;

  const todayFull = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function goToStep(current: Step, next: Step) {
    setCompletedSteps((prev) => new Set([...prev, current]));
    setActiveStep(next);
  }

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

  const step2Summary = (() => {
    if (durationSeconds === 0) return "미설정";
    const h = hours > 0 ? `${hours}h` : "";
    const m = minutes > 0 ? `${minutes}m` : "";
    const dur = [h, m].filter(Boolean).join(" ");
    return to ? `${dur} · ${to}` : dur;
  })();

  return (
    <main className="relative flex min-h-screen w-full flex-col bg-fr-base">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fr-surface via-fr-base to-fr-deep" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-10%,rgba(56,189,248,0.05),transparent)]" />

      <AppHeader active="home" />

      <div className="relative z-10 flex flex-col items-center px-4 pt-6 pb-10 sm:px-6">
        <p className="mb-6 text-[9px] tracking-[0.5em] text-white/18 uppercase">
          Ready for Takeoff
        </p>

        <div className="w-full max-w-3xl">
          {/* Tab bar */}
          <div className="flex items-center border-b border-white/[0.07]">
            {(["new", "active"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`-mb-px border-b-2 px-5 py-3 text-[13px] font-medium transition-colors ${
                  tab === t
                    ? "border-sky-500 text-white"
                    : "border-transparent text-white/28 hover:text-white/50"
                }`}
              >
                {t === "new" ? "새 여행" : "진행중인 여행"}
              </button>
            ))}
            <div className="flex-1" />
            <span className="hidden pr-1 pb-3 text-[11px] text-white/18 sm:inline">
              {todayFull}
            </span>
          </div>

          {/* Card */}
          <div className="rounded-tr-3xl rounded-b-3xl border border-t-0 border-white/[0.07] bg-fr-overlay/60 backdrop-blur-sm">
            {tab === "active" ? (
              resumedFlight ? (
                <div className="px-5 py-6 sm:px-8">
                  <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="mb-2 text-[9px] tracking-widest text-white/28 uppercase">
                          저장된 여행
                        </p>
                        <p className="text-[22px] leading-none font-bold tracking-tight text-white">
                          {resumedFlight.from}
                          <span className="mx-2 font-light text-white/30">
                            →
                          </span>
                          {resumedFlight.to ?? "—"}
                        </p>
                        {resumedFlight.subject && (
                          <p className="mt-1 text-[12px] text-sky-400/70">
                            {resumedFlight.subject}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          localStorage.removeItem("flightrail:resumeFlight");
                          setResumedFlight(null);
                        }}
                        className="mt-0.5 text-[18px] leading-none text-white/20 transition-colors hover:text-white/50"
                        aria-label="저장 삭제"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex gap-3 text-[11px] text-white/35">
                      <span>
                        {formatElapsed(resumedFlight.elapsed)} 비행 완료
                      </span>
                      <span className="text-white/15">·</span>
                      <span>목표 {formatElapsed(resumedFlight.duration)}</span>
                    </div>
                    <button
                      onClick={() => {
                        const {
                          from,
                          to,
                          subject,
                          duration,
                          hardStop,
                          elapsed,
                        } = resumedFlight;
                        if (!to) return;
                        const params = new URLSearchParams({
                          from,
                          to,
                          subject,
                          duration: String(duration),
                          hardStop: String(hardStop),
                          elapsed: String(elapsed),
                        });
                        localStorage.removeItem("flightrail:resumeFlight");
                        router.push(`/timer?${params}`);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-fr-sky-deep py-3 text-[13px] font-semibold text-white transition-colors hover:bg-fr-sky-deep/90"
                    >
                      <PlaneIcon size={14} />
                      이어서 비행하기
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 px-6 py-14">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/25">
                    <PlaneIcon size={22} />
                  </div>
                  <p className="text-[13px] text-white/35">
                    저장된 여행이 없습니다
                  </p>
                  <Link
                    href="/timer"
                    className="rounded-xl border border-white/[0.08] px-5 py-2.5 text-[13px] text-white/50 transition-colors hover:border-white/20 hover:text-white/80"
                  >
                    타이머로 이동
                  </Link>
                </div>
              )
            ) : (
              <div className="flex flex-col">
                {/* Step 1: 출발지 */}
                <AccordionStep
                  step={1}
                  activeStep={activeStep}
                  completedSteps={completedSteps}
                  title="출발지"
                  summary={from}
                  onHeaderClick={() => setActiveStep(1)}
                >
                  <DepartureSelector
                    from={from}
                    onFrom={(v) => {
                      if (v === from) return;
                      setFrom(v);
                      setTo(null);
                      setCompletedSteps((prev) => {
                        const next = new Set(prev);
                        next.delete(2);
                        return next;
                      });
                    }}
                  />
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={() => goToStep(1, 2)}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.07] px-6 py-2.5 text-[13px] font-semibold text-white/70 transition-colors hover:bg-white/[0.10] hover:text-white"
                    >
                      다음
                    </button>
                  </div>
                </AccordionStep>

                {/* Step 2: 비행 시간 & 목적지 */}
                <AccordionStep
                  step={2}
                  activeStep={activeStep}
                  completedSteps={completedSteps}
                  title="비행 시간 & 목적지"
                  summary={step2Summary}
                  onHeaderClick={() => setActiveStep(2)}
                >
                  {/* 지도 먼저 — 시간 바꿀때마다 목적지 후보 시각화 */}
                  <DepartureMap
                    from={from}
                    to={to}
                    candidates={candidateAirports}
                    onSelectCandidate={setTo}
                  />

                  <p className="mt-5 mb-4 text-[9px] tracking-widest text-white/28 uppercase">
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
                  {candidates.length === 0 && durationSeconds === 0 && (
                    <p className="mt-2 text-[12px] text-white/20">
                      시간을 설정하면 목적지 후보가 표시됩니다
                    </p>
                  )}

                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={() => goToStep(2, 3)}
                      disabled={!canDepart}
                      className={`rounded-xl border px-6 py-2.5 text-[13px] font-semibold transition-colors ${
                        canDepart
                          ? "border-white/[0.08] bg-white/[0.07] text-white/70 hover:bg-white/[0.10] hover:text-white"
                          : "cursor-not-allowed border-white/[0.04] bg-white/[0.02] text-white/20"
                      }`}
                    >
                      다음
                    </button>
                  </div>
                </AccordionStep>

                {/* Step 3: 여행 목적 */}
                <AccordionStep
                  step={3}
                  activeStep={activeStep}
                  completedSteps={completedSteps}
                  title="여행 목적"
                  summary={subject || "—"}
                  onHeaderClick={() => setActiveStep(3)}
                >
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setActiveStep(4)}
                    placeholder="무엇을 공부할 예정인가요?"
                    className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/18 sm:text-[16px]"
                  />
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["알고리즘", "영어", "수학", "프로그래밍", "독서"].map(
                      (tag) => (
                        <button
                          key={tag}
                          onClick={() => setSubject(subject === tag ? "" : tag)}
                          className={`rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
                            subject === tag
                              ? "border-sky-500/60 bg-sky-500/10 text-sky-400"
                              : "border-white/[0.07] text-white/25 hover:border-white/15 hover:text-white/50 active:bg-white/5"
                          }`}
                        >
                          {tag}
                        </button>
                      ),
                    )}
                  </div>
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={() => goToStep(3, 4)}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.07] px-6 py-2.5 text-[13px] font-semibold text-white/70 transition-colors hover:bg-white/[0.10] hover:text-white"
                    >
                      다음
                    </button>
                  </div>
                </AccordionStep>

                {/* Step 4: 착륙 옵션 */}
                <AccordionStep
                  step={4}
                  activeStep={activeStep}
                  completedSteps={completedSteps}
                  title="착륙 옵션"
                  summary={hardStop ? "자동 착륙" : "계속 비행"}
                  onHeaderClick={() => {}}
                >
                  <div className="mb-5 flex gap-2">
                    {(
                      [
                        {
                          v: false,
                          label: "계속 비행",
                          desc: "목표 시간 후에도 타이머가 계속 실행됩니다. 직접 착륙을 선택해야 기록됩니다.",
                          icon: <PlaneIcon size={12} />,
                        },
                        {
                          v: true,
                          label: "자동 착륙",
                          desc: "목표 시간이 되면 자동으로 세션이 종료되고 기록됩니다.",
                          icon: <LandingIcon size={12} />,
                        },
                      ] as const
                    ).map(({ v, label, desc, icon }) => (
                      <button
                        key={String(v)}
                        onClick={() => setHardStop(v)}
                        className={`flex flex-1 items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                          hardStop === v
                            ? "border-sky-500/45 bg-sky-500/7 text-white"
                            : "border-white/[0.06] text-white/40 hover:border-white/12 hover:text-white/60"
                        }`}
                      >
                        <span
                          className={`mt-0.5 shrink-0 ${hardStop === v ? "text-sky-400" : "text-white/28"}`}
                        >
                          {icon}
                        </span>
                        <div>
                          <p className="mb-1.5 text-[12px] leading-none font-medium">
                            {label}
                          </p>
                          <p
                            className={`text-[10px] leading-relaxed ${hardStop === v ? "text-white/40" : "text-white/22"}`}
                          >
                            {desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleDepart}
                    disabled={!canDepart}
                    className={`flex w-full items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-[14px] font-semibold tracking-wide transition-all duration-200 ${
                      canDepart
                        ? "bg-fr-sky-deep text-white shadow-lg shadow-black/40 hover:bg-fr-sky-deep/90 active:bg-fr-sky-deep"
                        : "cursor-not-allowed bg-white/4 text-white/18"
                    }`}
                  >
                    <PlaneIcon size={18} />
                    <span>예매하기</span>
                  </button>
                </AccordionStep>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
