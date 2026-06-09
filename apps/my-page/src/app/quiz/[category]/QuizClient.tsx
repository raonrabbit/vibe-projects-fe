"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/cn";
import {
  CATEGORY_LABELS,
  type QuizCategory,
  type QuizQuestion,
} from "@/shared/data/quiz-questions";
import { useQuizProgress } from "@/shared/lib/useQuizProgress";

function sortQuestions(
  questions: QuizQuestion[],
  progress: Record<string, string>,
): QuizQuestion[] {
  const unknown = questions.filter((q) => progress[q.id] === "unknown");
  const fresh = questions.filter((q) => !progress[q.id]);
  const known = questions.filter((q) => progress[q.id] === "known");

  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  return [...shuffle(unknown), ...shuffle(fresh), ...shuffle(known)];
}

interface Props {
  questions: QuizQuestion[];
  category: QuizCategory | "all";
}

export default function QuizClient({ questions, category }: Props) {
  const { progress, mark, resetCategory, getStats } = useQuizProgress();

  const [sorted, setSorted] = useState<QuizQuestion[]>(() =>
    sortQuestions(questions, {}),
  );
  const [index, setIndex] = useState(0);
  const [revealed, setReveal] = useState(false);
  const directionRef = useRef<1 | -1>(1);
  const [done, setDone] = useState(false);
  const [note, setNote] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setSorted(sortQuestions(questions, progress));
    setIndex(0);
    setReveal(false);
    setDone(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const current = sorted[index];
  const stats = getStats(questions.map((q) => q.id));

  // ── touch / swipe ──────────────────────────────────────────────────────────
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // ── actions ────────────────────────────────────────────────────────────────
  const advance = useCallback(
    (dir: 1 | -1) => {
      directionRef.current = dir;
      setReveal(false);
      setNote("");
      if (index + 1 >= sorted.length) {
        setDone(true);
      } else {
        setIndex((i) => i + 1);
      }
    },
    [index, sorted.length],
  );

  const handleKnown = useCallback(() => {
    if (!current) return;
    mark(current.id, "known");
    advance(1);
  }, [current, mark, advance]);

  const handleUnknown = useCallback(() => {
    if (!current) return;
    mark(current.id, "unknown");
    advance(-1);
  }, [current, mark, advance]);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (!revealed || Math.abs(diff) < 50) return;
      if (diff < 0) handleUnknown();
      else handleKnown();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [revealed, index, sorted],
  );

  // ── keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setReveal((r) => !r);
      }
      if (!revealed) return;
      if (e.key === "ArrowRight") handleKnown();
      if (e.key === "ArrowLeft") handleUnknown();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, index, sorted]);

  const handleReset = () => {
    resetCategory(category);
    setSorted(sortQuestions(questions, {}));
    setIndex(0);
    setReveal(false);
    setDone(false);
  };

  const restart = () => {
    setSorted(sortQuestions(questions, progress));
    setIndex(0);
    setReveal(false);
    setDone(false);
  };

  // ── done screen ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <p className="mb-4 text-4xl">완료!</p>
          <p className="mb-2 text-text-primary/60">
            알았다{" "}
            <span className="font-bold text-text-primary">{stats.known}</span> ·
            몰랐다{" "}
            <span className="font-bold text-text-primary">{stats.unknown}</span>{" "}
            / 전체 {stats.total}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={restart}
              className="rounded-lg border border-text-primary/20 px-5 py-2.5 text-sm transition-colors hover:border-text-primary/50"
            >
              다시 풀기
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-text-primary/20 px-5 py-2.5 text-sm transition-colors hover:border-text-primary/50"
            >
              기록 초기화
            </button>
            <Link
              href="/quiz"
              className="rounded-lg border border-text-primary/20 px-5 py-2.5 text-sm transition-colors hover:border-text-primary/50"
            >
              ← 카테고리 목록
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const categoryLabel =
    category === "all" ? "전체" : CATEGORY_LABELS[category as QuizCategory];

  return (
    <div className="flex min-h-screen flex-col items-center px-4 pt-20 pb-20 select-none">
      {/* top nav */}
      <div className="mb-8 flex w-full max-w-lg items-center justify-between">
        <Link
          href="/quiz"
          className="text-sm text-text-primary/50 transition-colors hover:text-text-primary/80"
        >
          ← 카테고리 목록
        </Link>
        <div className="flex items-center gap-4 text-xs text-text-primary/40">
          <span>알았다 {stats.known}</span>
          <span>몰랐다 {stats.unknown}</span>
          <button
            onClick={handleReset}
            className="transition-colors hover:text-text-primary/70"
          >
            초기화
          </button>
        </div>
      </div>

      {/* category + count */}
      <div className="mb-3 w-full max-w-lg">
        <span className="text-xs tracking-wider text-text-primary/40 uppercase">
          {categoryLabel}
        </span>
        <p className="mt-0.5 text-sm text-text-primary/50">
          {index + 1} / {sorted.length}
        </p>
      </div>

      {/* progress bar */}
      <div className="mb-8 h-1 w-full max-w-lg rounded-full bg-text-primary/10">
        <div
          className="h-full rounded-full bg-text-primary/40 transition-all"
          style={{ width: `${((index + 1) / sorted.length) * 100}%` }}
        />
      </div>

      {/* card */}
      <AnimatePresence mode="wait" initial={false} custom={directionRef}>
        <motion.div
          key={current.id}
          custom={directionRef}
          variants={{
            enter: (ref: MutableRefObject<1 | -1>) => ({
              opacity: 0,
              x: -ref.current * 40,
            }),
            center: { opacity: 1, x: 0 },
            exit: (ref: MutableRefObject<1 | -1>) => ({
              opacity: 0,
              x: ref.current * 40,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.18 }}
          className="w-full max-w-lg"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex min-h-[220px] flex-col gap-4 rounded-2xl border border-text-primary/10 p-7">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-text-primary/15 px-2 py-0.5 text-xs text-text-primary/50">
                {CATEGORY_LABELS[current.category]}
              </span>
              {current.isAdvanced && (
                <span className="rounded-full border border-text-primary/15 px-2 py-0.5 text-xs text-text-primary/40">
                  심화
                </span>
              )}
              {current.id.startsWith("custom-") && (
                <span className="rounded-full border border-text-primary/15 px-2 py-0.5 text-xs text-text-primary/40">
                  직접 추가
                </span>
              )}
            </div>

            <p className="text-base leading-relaxed font-medium">
              {current.question}
            </p>

            <AnimatePresence initial={false}>
              {revealed && (
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-text-primary/10 pt-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-text-primary/70">
                      {current.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* scratch pad */}
      <div className="mt-5 w-full max-w-lg">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder="여기에 자유롭게 적어보세요..."
          rows={4}
          className="w-full resize-none rounded-xl border border-text-primary/10 bg-transparent px-4 py-3 text-sm leading-relaxed text-text-primary/80 placeholder:text-text-primary/25 focus:border-text-primary/30 focus:outline-none"
        />
      </div>

      {/* action buttons */}
      <div className="mt-3 flex w-full max-w-lg flex-col gap-3">
        <button
          onClick={() => setReveal((r) => !r)}
          className="w-full rounded-xl border border-text-primary/20 py-3 text-sm font-medium transition-colors hover:border-text-primary/50"
        >
          {revealed ? "답변 숨기기" : "정답 보기"}{" "}
          <span className="ml-1 text-text-primary/30">[Space]</span>
        </button>

        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="flex gap-3"
          >
            <button
              onClick={handleUnknown}
              className={cn(
                "flex-1 rounded-xl border py-3.5 text-sm font-medium transition-colors",
                "border-text-primary/20 hover:border-red-400/60 hover:text-red-500 dark:hover:text-red-400",
              )}
            >
              몰랐다{" "}
              <span className="ml-0.5 text-xs text-text-primary/30">[←]</span>
            </button>
            <button
              onClick={handleKnown}
              className={cn(
                "flex-1 rounded-xl border py-3.5 text-sm font-medium transition-colors",
                "border-text-primary/20 hover:border-emerald-400/60 hover:text-emerald-500 dark:hover:text-emerald-400",
              )}
            >
              알았다{" "}
              <span className="ml-0.5 text-xs text-text-primary/30">[→]</span>
            </button>
          </motion.div>
        )}
      </div>

      {revealed && (
        <p className="mt-4 text-xs text-text-primary/25 md:hidden">
          좌로 스와이프: 몰랐다 · 우로 스와이프: 알았다
        </p>
      )}
    </div>
  );
}
