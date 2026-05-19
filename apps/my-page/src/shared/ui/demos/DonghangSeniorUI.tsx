"use client";

import { useState } from "react";

// 실제 프로젝트 색상값
const COLORS = {
  seniorNum: { bg: "#187D4D", text: "#FFFFFF" },
  regularNum: { bg: "#E5EBFF", text: "#4B5563" },
  deleteBtn: { bg: "#3D5EDD", text: "#FFFFFF" },
  confirmBtn: { bg: "#187D4D", text: "#FFFFFF" },
  cancelBtn: { bg: "#E53E3E", text: "#FFFFFF" },
};

interface KeypadConfig {
  numBg: string;
  numText: string;
  deleteLabel: string;
  clearLabel: string;
  fontSize: string;
  padSize: string;
}

const SENIOR_CONFIG: KeypadConfig = {
  numBg: COLORS.seniorNum.bg,
  numText: COLORS.seniorNum.text,
  deleteLabel: "하나 지우기",
  clearLabel: "전부 지우기",
  fontSize: "text-2xl",
  padSize: "w-[200px]",
};

const REGULAR_CONFIG: KeypadConfig = {
  numBg: COLORS.regularNum.bg,
  numText: COLORS.regularNum.text,
  deleteLabel: "지움",
  clearLabel: "정정",
  fontSize: "text-base",
  padSize: "w-[160px]",
};

function Keypad({ config }: { config: KeypadConfig }) {
  const [value, setValue] = useState("");

  const press = (char: string) =>
    setValue((v) => (v.length < 8 ? v + char : v));
  const del = () => setValue((v) => v.slice(0, -1));
  const clear = () => setValue("");

  const numStyle = {
    backgroundColor: config.numBg,
    color: config.numText,
  };
  const delStyle = {
    backgroundColor: COLORS.deleteBtn.bg,
    color: COLORS.deleteBtn.text,
  };
  const confirmStyle = {
    backgroundColor: COLORS.confirmBtn.bg,
    color: COLORS.confirmBtn.text,
  };
  const cancelStyle = {
    backgroundColor: COLORS.cancelBtn.bg,
    color: COLORS.cancelBtn.text,
  };

  const btn = `${config.fontSize} flex items-center justify-center rounded-xl font-semibold transition-opacity active:opacity-70 select-none cursor-pointer`;

  return (
    <div className={`${config.padSize} flex flex-col gap-1.5`}>
      {/* 입력 표시 */}
      <div className="mb-1 flex h-9 items-center justify-end rounded-lg bg-zinc-100 px-3 dark:bg-zinc-800">
        <span
          className={`font-mono font-bold tracking-widest text-zinc-700 dark:text-zinc-200 ${config.fontSize}`}
        >
          {value ? (
            "●".repeat(value.length)
          ) : (
            <span className="text-sm text-zinc-300">입력</span>
          )}
        </span>
      </div>

      {/* 1 2 3 */}
      <div className="grid grid-cols-3 gap-1.5">
        {["1", "2", "3"].map((n) => (
          <button
            key={n}
            style={numStyle}
            onClick={() => press(n)}
            className={`${btn} aspect-square`}
          >
            {n}
          </button>
        ))}
      </div>
      {/* 4 5 6 */}
      <div className="grid grid-cols-3 gap-1.5">
        {["4", "5", "6"].map((n) => (
          <button
            key={n}
            style={numStyle}
            onClick={() => press(n)}
            className={`${btn} aspect-square`}
          >
            {n}
          </button>
        ))}
      </div>
      {/* 7 8 9 */}
      <div className="grid grid-cols-3 gap-1.5">
        {["7", "8", "9"].map((n) => (
          <button
            key={n}
            style={numStyle}
            onClick={() => press(n)}
            className={`${btn} aspect-square`}
          >
            {n}
          </button>
        ))}
      </div>
      {/* 지우기 0 전부지우기 */}
      <div className="grid grid-cols-3 gap-1.5">
        <button
          style={delStyle}
          onClick={del}
          className={`${btn} aspect-square px-1 text-xs leading-tight break-keep`}
        >
          {config.deleteLabel}
        </button>
        <button
          style={numStyle}
          onClick={() => press("0")}
          className={`${btn} aspect-square`}
        >
          0
        </button>
        <button
          style={delStyle}
          onClick={clear}
          className={`${btn} aspect-square px-1 text-xs leading-tight break-keep`}
        >
          {config.clearLabel}
        </button>
      </div>
      {/* 확인 취소 */}
      <div className="grid grid-cols-2 gap-1.5">
        <button
          style={confirmStyle}
          onClick={clear}
          className={`${btn} rounded-xl py-2.5`}
        >
          확인
        </button>
        <button
          style={cancelStyle}
          onClick={clear}
          className={`${btn} rounded-xl py-2.5`}
        >
          취소
        </button>
      </div>
    </div>
  );
}

export function DonghangSeniorUIDemo() {
  const [isSenior, setIsSenior] = useState(false);
  const config = isSenior ? SENIOR_CONFIG : REGULAR_CONFIG;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
      {/* Toggle bar */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/60">
        <span className="text-xs text-zinc-400">모드 전환</span>
        <div className="flex items-center gap-2.5">
          <span
            className={`text-xs font-medium transition-colors ${!isSenior ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-300 dark:text-zinc-600"}`}
          >
            일반
          </span>
          <button
            onClick={() => setIsSenior((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-colors ${isSenior ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"}`}
          >
            <div
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${isSenior ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
          <span
            className={`text-xs font-medium transition-colors ${isSenior ? "text-blue-600 dark:text-blue-400" : "text-zinc-300 dark:text-zinc-600"}`}
          >
            시니어
          </span>
        </div>
      </div>

      {/* Keypad area */}
      <div className="flex justify-center bg-white px-4 py-5 dark:bg-zinc-900">
        <Keypad config={config} key={isSenior ? "senior" : "regular"} />
      </div>

      {/* Spec badges — 시니어 모드일 때만 표시 */}
      {isSenior && (
        <div className="flex flex-wrap gap-2 border-t border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/40">
          <span className="rounded-full border border-emerald-200 px-2.5 py-1 font-mono text-xs text-emerald-600 dark:border-emerald-900/50 dark:text-emerald-400">
            버튼 크기 +25%
          </span>
          <span className="rounded-full border border-zinc-200 px-2.5 py-1 font-mono text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            명암비 4.5:1 ✓ WCAG 2.1 AA
          </span>
          <span className="rounded-full border border-zinc-200 px-2.5 py-1 font-mono text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            터치 영역 ≥44px
          </span>
          <span className="rounded-full border border-blue-200 px-2.5 py-1 font-mono text-xs text-blue-500 dark:border-blue-900/50 dark:text-blue-400">
            &ldquo;이체 → 송금하기&rdquo; 용어 개선
          </span>
        </div>
      )}
    </div>
  );
}
