"use client";

import { useEffect, useRef, useState } from "react";

type DeployStep = "idle" | "push" | "build" | "reload-1" | "reload-2" | "done";

const STEP_ORDER: DeployStep[] = [
  "push",
  "build",
  "reload-1",
  "reload-2",
  "done",
];

const STATUS_MSG: Record<DeployStep, string> = {
  idle: "",
  push: "main 브랜치에 push — GitHub Actions 트리거됨",
  build: "SSH 접속 → git pull → npm ci → npm run build 진행 중...",
  "reload-1": "Instance 0 재시작 중 — Instance 1이 모든 요청을 처리",
  "reload-2": "Instance 1 재시작 중 — Instance 0이 모든 요청을 처리",
  done: "두 인스턴스 모두 새 버전으로 정상 서비스 중",
};

export function KuaRollingDeployDemo() {
  const [step, setStep] = useState<DeployStep>("idle");
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function runSimulation() {
    if (running) return;
    clearTimers();
    setRunning(true);
    setStep("push");

    const schedule: [DeployStep, number][] = [
      ["build", 1000],
      ["reload-1", 2200],
      ["reload-2", 3600],
      ["done", 5000],
    ];

    schedule.forEach(([s, d]) => {
      timers.current.push(setTimeout(() => setStep(s), d));
    });
    timers.current.push(setTimeout(() => setRunning(false), 5400));
  }

  function reset() {
    clearTimers();
    setStep("idle");
    setRunning(false);
  }

  useEffect(() => () => clearTimers(), []);

  const stepIdx = STEP_ORDER.indexOf(step);

  const inst0: InstanceState =
    step === "reload-1" ? "restarting" : step === "idle" ? "idle" : "serving";
  const inst1: InstanceState =
    step === "reload-2" ? "restarting" : step === "idle" ? "idle" : "serving";

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
      {/* ── 파이프라인 ── */}
      <div className="bg-zinc-50 p-4 dark:bg-zinc-900/60">
        <p className="mb-3 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          배포 파이프라인
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <PipeNode
            active={stepIdx >= 0}
            label="Push"
            activeClass="bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900"
          />
          <Chevron active={stepIdx >= 0} />
          <PipeNode
            active={stepIdx >= 0}
            label="Actions"
            activeClass="bg-orange-500 text-white"
          />
          <Chevron active={stepIdx >= 1} />
          <PipeNode
            active={stepIdx >= 1}
            label="Build"
            activeClass="bg-blue-500 text-white"
          />
          <Chevron active={stepIdx >= 2} />
          <PipeNode
            active={stepIdx >= 2}
            label="pm2 reload"
            activeClass="bg-emerald-500 text-white"
            pulse={step === "reload-1" || step === "reload-2"}
          />
          <Chevron active={stepIdx >= 4} />
          <PipeNode
            active={stepIdx >= 4}
            label="완료"
            activeClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
          />
        </div>
      </div>

      {/* ── PM2 클러스터 다이어그램 ── */}
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
        <p className="mb-3 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          PM2 cluster — 인스턴스 상태
        </p>

        <div className="flex items-center gap-3">
          {/* 트래픽 */}
          <div className="shrink-0 rounded-xl border-2 border-zinc-200 bg-white px-3 py-3 text-center dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-[10px] font-semibold text-zinc-500">사용자</p>
            <p className="text-[10px] text-zinc-400">트래픽</p>
          </div>

          {/* 화살표 */}
          <div className="flex shrink-0 flex-col gap-4">
            <TrafficArrow active={inst0 === "serving"} />
            <TrafficArrow active={inst1 === "serving"} />
          </div>

          {/* 인스턴스 */}
          <div className="flex flex-1 flex-col gap-2">
            <InstanceCard label="Instance 0" state={inst0} />
            <InstanceCard label="Instance 1" state={inst1} />
          </div>
        </div>

        {/* 상태 메시지 */}
        <div
          className={`mt-3 overflow-hidden rounded-lg transition-all duration-300 ${
            step === "idle" ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
          }`}
        >
          <div className="bg-zinc-50 px-3 py-2 dark:bg-zinc-900/60">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {STATUS_MSG[step]}
            </p>
          </div>
        </div>
      </div>

      {/* ── 컨트롤 ── */}
      <div className="flex items-center gap-3 border-t border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/40">
        <button
          onClick={
            running ? undefined : step === "idle" ? runSimulation : reset
          }
          disabled={running}
          className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
            running
              ? "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
              : "cursor-pointer bg-black text-white hover:opacity-75 dark:bg-white dark:text-black"
          }`}
        >
          {running
            ? "배포 중..."
            : step === "idle"
              ? "▶ 배포 시뮬레이션"
              : "↺ 다시"}
        </button>
        {step === "idle" && (
          <p className="text-xs text-zinc-400">
            버튼을 눌러 무중단 배포 흐름을 확인하세요
          </p>
        )}
      </div>
    </div>
  );
}

/* ── 서브 컴포넌트 ── */

type InstanceState = "idle" | "serving" | "restarting";

function PipeNode({
  active,
  label,
  activeClass,
  pulse = false,
}: {
  active: boolean;
  label: string;
  activeClass: string;
  pulse?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-300 ${
        active
          ? `${activeClass} ${pulse ? "animate-pulse" : ""}`
          : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
      }`}
    >
      <span>{label}</span>
    </div>
  );
}

function Chevron({ active }: { active: boolean }) {
  return (
    <span
      className={`text-sm transition-colors duration-300 ${
        active
          ? "text-zinc-500 dark:text-zinc-400"
          : "text-zinc-200 dark:text-zinc-700"
      }`}
    >
      →
    </span>
  );
}

function TrafficArrow({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      <div
        className={`h-0.5 w-6 transition-all duration-300 ${
          active ? "bg-emerald-400" : "bg-zinc-200 dark:bg-zinc-700"
        }`}
      />
      <span
        className={`text-xs transition-colors duration-300 ${
          active ? "text-emerald-400" : "text-zinc-200 dark:text-zinc-700"
        }`}
      >
        ▶
      </span>
    </div>
  );
}

function InstanceCard({
  label,
  state,
}: {
  label: string;
  state: InstanceState;
}) {
  const borderColor =
    state === "serving"
      ? "border-emerald-400"
      : state === "restarting"
        ? "border-amber-400"
        : "border-zinc-200 dark:border-zinc-700";

  const bg =
    state === "serving"
      ? "bg-emerald-50 dark:bg-emerald-900/20"
      : state === "restarting"
        ? "bg-amber-50 dark:bg-amber-900/20"
        : "bg-white dark:bg-zinc-800";

  const dotColor =
    state === "serving"
      ? "bg-emerald-400"
      : state === "restarting"
        ? "bg-amber-400 animate-pulse"
        : "bg-zinc-300 dark:bg-zinc-600";

  const textColor =
    state === "serving"
      ? "text-emerald-700 dark:text-emerald-300"
      : state === "restarting"
        ? "text-amber-700 dark:text-amber-300"
        : "text-zinc-400";

  const subText =
    state === "serving"
      ? "요청 처리 중"
      : state === "restarting"
        ? "재시작 중..."
        : "대기";

  const subColor =
    state === "serving"
      ? "text-emerald-500"
      : state === "restarting"
        ? "text-amber-500"
        : "text-zinc-300 dark:text-zinc-600";

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 transition-all duration-300 ${borderColor} ${bg}`}
    >
      <div
        className={`h-2.5 w-2.5 shrink-0 rounded-full transition-all ${dotColor}`}
      />
      <div>
        <p className={`text-xs font-semibold ${textColor}`}>{label}</p>
        <p className={`mt-0.5 text-[10px] ${subColor}`}>{subText}</p>
      </div>
      <div className="ml-auto text-xs">
        {state === "serving" && <span className="text-emerald-400">●</span>}
        {state === "restarting" && <span className="text-amber-400">♻️</span>}
      </div>
    </div>
  );
}
