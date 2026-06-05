"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="my-6 flex flex-wrap items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-5 dark:border-zinc-700 dark:bg-zinc-900">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        이 버튼을 눌러보세요 →
      </span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCount((c) => c - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-lg font-bold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          aria-label="감소"
        >
          −
        </button>
        <span className="min-w-[2.5rem] text-center text-2xl font-bold text-zinc-900 tabular-nums dark:text-zinc-100">
          {count}
        </span>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-lg font-bold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          aria-label="증가"
        >
          +
        </button>
      </div>
    </div>
  );
}
