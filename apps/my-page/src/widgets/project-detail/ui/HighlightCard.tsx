"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectHighlight } from "@/entities/project";
import { CodeDemoViewer } from "@/shared/ui/CodeDemoViewer";
import { UIDemoViewer } from "@/shared/ui/UIDemoViewer";

/* ────────────── 메트릭 파싱 ────────────── */
type MetricData =
  | { type: "before-after"; before: string; after: string; note: string }
  | { type: "percent"; value: string; label: string }
  | { type: "text"; value: string };

function parseMetric(metric: string): MetricData {
  // "X → Y (note)" 패턴
  const arrowMatch = metric.match(/^(.+?)\s*→\s*(.+?)\s*\((.+?)\)$/);
  if (arrowMatch) {
    return {
      type: "before-after",
      before: arrowMatch[1].trim(),
      after: arrowMatch[2].trim(),
      note: arrowMatch[3].trim(),
    };
  }
  // "~70%" 또는 "100%" 포함 패턴
  const percentMatch = metric.match(/(~?\d+(?:\.\d+)?%)/);
  if (percentMatch) {
    const pct = percentMatch[1];
    const label = metric.replace(pct, "").trim();
    return { type: "percent", value: pct, label };
  }
  return { type: "text", value: metric };
}

/* ────────────── 메트릭 표시 UI ────────────── */
function MetricDisplay({ metric }: { metric: string }) {
  const data = parseMetric(metric);

  if (data.type === "before-after") {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-900/60">
        {/* Before */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            이전
          </p>
          <p className="mt-1 text-3xl font-black text-zinc-300 line-through decoration-red-400 dark:text-zinc-600">
            {data.before}
          </p>
        </div>

        {/* Arrow */}
        <svg
          className="shrink-0 text-zinc-300 dark:text-zinc-600"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>

        {/* After */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wider text-emerald-500 uppercase">
            이후
          </p>
          <p className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {data.after}
          </p>
        </div>

        {/* Note badge */}
        <span className="ml-auto shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          {data.note}
        </span>
      </div>
    );
  }

  if (data.type === "percent") {
    return (
      <div className="flex items-center gap-4 rounded-2xl bg-zinc-50 px-5 py-4 dark:bg-zinc-900/60">
        <span className="text-4xl font-black tracking-tight text-black dark:text-white">
          {data.value}
        </span>
        {data.label && (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {data.label}
          </span>
        )}
      </div>
    );
  }

  // text fallback — 기존 pill 스타일 유지
  return (
    <span className="inline-block rounded-full bg-black px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-black">
      {data.value}
    </span>
  );
}

/* ────────────── 개별 하이라이트 카드 ────────────── */
export function HighlightCard({
  highlight,
  index,
}: {
  highlight: ProjectHighlight;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${index * 70}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(18px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
      }}
      className="rounded-2xl border border-black/8 p-6 dark:border-white/8"
    >
      {/* 제목 */}
      <h3 className="font-semibold text-black dark:text-white">
        {highlight.title}
      </h3>

      {/* 메트릭 — 눈에 띄게 상단 표시 */}
      {highlight.metric && (
        <div className="mt-2 mb-5">
          <MetricDisplay metric={highlight.metric} />
        </div>
      )}

      {/* WHY / HOW / RESULT */}
      <div className="mt-4 space-y-3">
        <div>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            WHY
          </span>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {highlight.why}
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            HOW
          </span>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {highlight.how}
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            RESULT
          </span>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {highlight.result}
          </p>
        </div>
      </div>

      {highlight.uiDemoId && <UIDemoViewer id={highlight.uiDemoId} />}
      {highlight.codeDemos && highlight.codeDemos.length > 0 && (
        <CodeDemoViewer demos={highlight.codeDemos} />
      )}
    </div>
  );
}
