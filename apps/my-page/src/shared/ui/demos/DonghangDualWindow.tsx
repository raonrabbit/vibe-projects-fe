"use client";

import { useState } from "react";

const IPC_EVENTS = [
  {
    dir: "main→sub",
    channel: "update-sub-state",
    desc: "입력 링크 활성화",
    color: "emerald",
  },
  {
    dir: "sub→main",
    channel: "sub-number-updated",
    desc: "숫자 입력값 전달",
    color: "blue",
  },
  {
    dir: "main→sub",
    channel: "set-sub-mode",
    desc: "numpad/경고 화면 전환",
    color: "emerald",
  },
  {
    dir: "sub→main",
    channel: "sub-button-pressed",
    desc: "확인/취소 버튼 이벤트",
    color: "blue",
  },
  {
    dir: "main→sub",
    channel: "set-senior-mode",
    desc: "시니어 모드 동기화",
    color: "emerald",
  },
] as const;

type Channel = (typeof IPC_EVENTS)[number]["channel"] | null;

function MainWindowContent({ channel }: { channel: Channel }) {
  if (channel === "sub-number-updated") {
    return (
      <>
        <div className="mb-1.5 h-6 rounded bg-zinc-100 dark:bg-zinc-700" />
        <div className="animate-pulse rounded-lg border-2 border-blue-400 bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
          <p className="text-center font-mono text-xs text-blue-600 dark:text-blue-400">
            ← 수신: &quot;1,234&quot;
          </p>
        </div>
        <div className="mt-1.5 h-6 w-2/3 rounded bg-zinc-100 dark:bg-zinc-700" />
        <div className="mt-3 rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900">
          <p className="text-center text-xs text-zinc-400">은행 업무 화면</p>
        </div>
      </>
    );
  }

  if (channel === "sub-button-pressed") {
    return (
      <>
        <div className="mb-1.5 h-6 rounded bg-zinc-100 dark:bg-zinc-700" />
        <div className="flex gap-2">
          <div className="flex-1 animate-pulse rounded-lg border border-emerald-300 bg-emerald-50 p-2 text-center dark:border-emerald-700 dark:bg-emerald-900/20">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              확인 ✓ 수신
            </p>
          </div>
          <div className="flex-1 rounded-lg bg-zinc-100 p-2 text-center dark:bg-zinc-700">
            <p className="text-xs text-zinc-400">취소</p>
          </div>
        </div>
        <div className="mt-1.5 h-6 w-2/3 rounded bg-zinc-100 dark:bg-zinc-700" />
        <div className="mt-3 rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900">
          <p className="text-center text-xs text-zinc-400">은행 업무 화면</p>
        </div>
      </>
    );
  }

  if (channel === "update-sub-state") {
    return (
      <>
        <div className="mb-1.5 h-6 rounded bg-zinc-100 dark:bg-zinc-700" />
        <div className="rounded-lg border border-emerald-200 bg-zinc-100 p-2 dark:border-emerald-800 dark:bg-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">입력 링크</span>
            <span className="animate-pulse rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-semibold text-white">
              송신 중 →
            </span>
          </div>
        </div>
        <div className="mt-1.5 h-6 w-2/3 rounded bg-zinc-100 dark:bg-zinc-700" />
        <div className="mt-3 rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900">
          <p className="text-center text-xs text-zinc-400">은행 업무 화면</p>
        </div>
      </>
    );
  }

  if (channel === "set-sub-mode") {
    return (
      <>
        <div className="mb-1.5 h-6 rounded bg-zinc-100 dark:bg-zinc-700" />
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-600 dark:text-amber-400">
              경고 모드 전환
            </span>
            <span className="animate-pulse font-mono text-xs text-amber-500">
              → 전송
            </span>
          </div>
        </div>
        <div className="mt-1.5 h-6 w-2/3 rounded bg-zinc-100 dark:bg-zinc-700" />
        <div className="mt-3 rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900">
          <p className="text-center text-xs text-zinc-400">은행 업무 화면</p>
        </div>
      </>
    );
  }

  if (channel === "set-senior-mode") {
    return (
      <>
        <div className="mb-1.5 h-6 rounded bg-zinc-100 dark:bg-zinc-700" />
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-2 dark:border-violet-800 dark:bg-violet-900/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-violet-600 dark:text-violet-400">
              시니어 모드
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-zinc-400">OFF</span>
              <div className="relative h-4 w-7 rounded-full bg-violet-400">
                <div className="absolute top-0.5 right-0.5 h-3 w-3 rounded-full bg-white shadow" />
              </div>
              <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400">
                ON
              </span>
            </div>
          </div>
        </div>
        <div className="mt-1.5 h-6 w-2/3 rounded bg-zinc-100 dark:bg-zinc-700" />
        <div className="mt-3 rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900">
          <p className="text-center text-xs text-zinc-400">은행 업무 화면</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-1.5">
        <div className="h-6 rounded bg-zinc-100 dark:bg-zinc-700" />
        <div className="h-12 rounded bg-zinc-100 dark:bg-zinc-700" />
        <div className="h-6 w-2/3 rounded bg-zinc-100 dark:bg-zinc-700" />
      </div>
      <div className="mt-3 rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900">
        <p className="text-center text-xs text-zinc-400">은행 업무 화면</p>
      </div>
    </>
  );
}

const NUMPAD_KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "←",
  "0",
  "✓",
];

function SubWindowContent({ channel }: { channel: Channel }) {
  if (channel === "set-sub-mode") {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-amber-300 bg-amber-50 py-3 dark:border-amber-700 dark:bg-amber-900/20">
        <span className="text-2xl">⚠️</span>
        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
          경고 화면으로 전환됨
        </p>
        <p className="text-[10px] text-amber-500">set-sub-mode 수신</p>
      </div>
    );
  }

  if (channel === "set-senior-mode") {
    return (
      <div className="grid grid-cols-3 gap-1">
        {NUMPAD_KEYS.map((n) => (
          <div
            key={n}
            className="flex aspect-square items-center justify-center rounded-lg border border-violet-200 bg-violet-50 text-sm font-extrabold text-violet-700 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-300"
          >
            {n}
          </div>
        ))}
      </div>
    );
  }

  if (channel === "update-sub-state") {
    return (
      <div className="grid grid-cols-3 gap-1">
        {NUMPAD_KEYS.map((n) => (
          <div
            key={n}
            className="flex aspect-square items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
          >
            {n}
          </div>
        ))}
      </div>
    );
  }

  if (channel === "sub-number-updated") {
    return (
      <div className="grid grid-cols-3 gap-1">
        {NUMPAD_KEYS.map((n) => (
          <div
            key={n}
            className={`flex aspect-square items-center justify-center rounded-lg text-xs font-bold transition-colors ${
              ["1", "2", "3", "4"].includes(n)
                ? "animate-pulse border border-blue-300 bg-blue-100 text-blue-600 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
            }`}
          >
            {n}
          </div>
        ))}
      </div>
    );
  }

  if (channel === "sub-button-pressed") {
    return (
      <div className="grid grid-cols-3 gap-1">
        {NUMPAD_KEYS.map((n) => (
          <div
            key={n}
            className={`flex aspect-square items-center justify-center rounded-lg text-xs font-bold transition-colors ${
              n === "✓"
                ? "animate-pulse border border-emerald-300 bg-emerald-100 text-emerald-600 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
            }`}
          >
            {n}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {NUMPAD_KEYS.map((n) => (
        <div
          key={n}
          className="flex aspect-square items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
        >
          {n}
        </div>
      ))}
    </div>
  );
}

export function DonghangDualWindowDemo() {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);

  const active = activeEvent !== null ? IPC_EVENTS[activeEvent] : null;
  const channel = active?.channel ?? null;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
      {/* Windows diagram */}
      <div className="flex items-stretch gap-0 bg-zinc-100 p-4 dark:bg-zinc-900/60">
        {/* Main window */}
        <div
          className={`flex flex-1 flex-col rounded-xl border-2 bg-white p-4 transition-all dark:bg-zinc-800 ${
            active?.dir === "main→sub"
              ? "border-emerald-400 shadow-md shadow-emerald-100 dark:shadow-emerald-900/30"
              : "border-zinc-200 dark:border-zinc-700"
          }`}
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-zinc-500">
              메인 윈도우
            </span>
            {active?.dir === "main→sub" && (
              <span className="ml-auto text-[10px] font-medium text-emerald-500">
                송신 →
              </span>
            )}
            {active?.dir === "sub→main" && (
              <span className="ml-auto text-[10px] font-medium text-blue-500">
                ← 수신
              </span>
            )}
          </div>
          <MainWindowContent channel={channel} />
        </div>

        {/* IPC center */}
        <div className="flex shrink-0 flex-col items-center justify-center gap-1 px-3">
          <div
            className={`flex items-center gap-0.5 text-xs transition-colors ${
              active?.dir === "main→sub"
                ? "text-emerald-500"
                : "text-zinc-300 dark:text-zinc-600"
            }`}
          >
            <span className="font-mono">→</span>
          </div>
          <div className="rounded border border-zinc-200 bg-white px-1.5 py-1 dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-center font-mono text-[9px] font-semibold text-zinc-400">
              IPC
            </p>
          </div>
          <div
            className={`flex items-center gap-0.5 text-xs transition-colors ${
              active?.dir === "sub→main"
                ? "text-blue-500"
                : "text-zinc-300 dark:text-zinc-600"
            }`}
          >
            <span className="font-mono">←</span>
          </div>
        </div>

        {/* Sub window */}
        <div
          className={`flex flex-1 flex-col rounded-xl border-2 bg-white p-4 transition-all dark:bg-zinc-800 ${
            active?.dir === "sub→main"
              ? "border-blue-400 shadow-md shadow-blue-100 dark:shadow-blue-900/30"
              : "border-zinc-200 dark:border-zinc-700"
          }`}
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-400" />
            <span className="text-xs font-semibold text-zinc-500">
              숫자 패드 창
            </span>
            {active?.dir === "sub→main" && (
              <span className="ml-auto text-[10px] font-medium text-blue-500">
                송신 →
              </span>
            )}
            {active?.dir === "main→sub" && (
              <span className="ml-auto text-[10px] font-medium text-emerald-500">
                ← 수신
              </span>
            )}
          </div>
          <SubWindowContent channel={channel} />
        </div>
      </div>

      {/* IPC events list */}
      <div className="border-t border-zinc-200 dark:border-zinc-700">
        <div className="px-4 py-2">
          <p className="text-xs text-zinc-400">
            IPC 이벤트 — 클릭하면 발신 창이 하이라이트됩니다
          </p>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {IPC_EVENTS.map((ev, i) => (
            <button
              key={i}
              onClick={() => setActiveEvent(activeEvent === i ? null : i)}
              className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60 ${
                activeEvent === i ? "bg-zinc-50 dark:bg-zinc-800/60" : ""
              }`}
            >
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  ev.dir === "main→sub"
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                }`}
              >
                {ev.dir}
              </span>
              <span className="font-mono text-xs text-zinc-500">
                {ev.channel}
              </span>
              <span className="ml-auto text-xs text-zinc-400">{ev.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-2 text-xs text-zinc-400 dark:border-zinc-800 dark:bg-zinc-800/40">
        단일 프로세스 내 IPC — 로컬 메모리 처리로 체감 지연 없음
      </div>
    </div>
  );
}
