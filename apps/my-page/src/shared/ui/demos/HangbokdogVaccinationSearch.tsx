"use client";

import { useMemo, useState } from "react";

const DOGS = [
  { name: "콩이", breed: "말티즈", age: "2세", vaccinated: false },
  { name: "보리", breed: "시베리안 허스키", age: "4세", vaccinated: true },
  { name: "두부", breed: "포메라니안", age: "1세", vaccinated: false },
  { name: "쿠키", breed: "비숑 프리제", age: "3세", vaccinated: false },
  { name: "모카", breed: "골든 리트리버", age: "5세", vaccinated: true },
  { name: "초코", breed: "닥스훈트", age: "2세", vaccinated: false },
  { name: "나비", breed: "스피츠", age: "3세", vaccinated: true },
  { name: "별이", breed: "웰시코기", age: "1세", vaccinated: false },
];

const EMOJI = ["🐶", "🐕", "🦮", "🐩", "🐾", "🦴", "🐕‍🦺", "🐩"];

export function HangbokdogVaccinationSearchDemo() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "pending" | "done">("all");

  const { filtered, filterMs } = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const t0 = performance.now();
    const result = DOGS.filter((d) => {
      const matchQuery =
        !query ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.breed.toLowerCase().includes(query.toLowerCase());
      const matchTab =
        tab === "all" ||
        (tab === "pending" && !d.vaccinated) ||
        (tab === "done" && d.vaccinated);
      return matchQuery && matchTab;
    });
    return {
      filtered: result,
      // eslint-disable-next-line react-hooks/purity
      filterMs: parseFloat((performance.now() - t0).toFixed(3)),
    };
  }, [query, tab]);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/60">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름 또는 품종 검색..."
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-800 transition-all outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200"
          />
          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 font-mono text-xs text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
            {filterMs !== null ? `${filterMs}ms` : "—"}
          </span>
        </div>
        {/* Tabs */}
        <div className="mt-2 flex gap-1">
          {(["all", "pending", "done"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                tab === t
                  ? "bg-amber-400/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              {t === "all" ? "전체" : t === "pending" ? "미완료" : "완료"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="max-h-52 divide-y divide-zinc-100 overflow-y-auto dark:divide-zinc-800">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-400">
            검색 결과 없음
          </div>
        ) : (
          filtered.map((dog) => (
            <div key={dog.name} className="flex items-center gap-3 px-4 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-base dark:bg-amber-900/20">
                {EMOJI[DOGS.indexOf(dog) % EMOJI.length]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {dog.name}
                </div>
                <div className="text-xs text-zinc-400">
                  {dog.breed} · {dog.age}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  dog.vaccinated
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                {dog.vaccinated ? "완료" : "미완료"}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-800/40">
        <span className="text-xs text-zinc-400">
          {filtered.length}/{DOGS.length}마리 — API 요청 없이 클라이언트 즉시
          필터링
        </span>
      </div>
    </div>
  );
}
