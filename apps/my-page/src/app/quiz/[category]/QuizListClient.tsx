"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/cn";
import {
  CATEGORY_LABELS,
  type QuizCategory,
  type QuizQuestion,
} from "@/shared/data/quiz-questions";
import { useQuizProgress } from "@/shared/lib/useQuizProgress";

interface Props {
  staticQuestions: QuizQuestion[];
  category: QuizCategory | "all";
}

function StatusDot({ status }: { status?: "known" | "unknown" }) {
  return (
    <span
      className={cn(
        "mt-1 h-2 w-2 flex-shrink-0 rounded-full",
        !status && "bg-text-primary/15",
        status === "known" && "bg-emerald-400/70",
        status === "unknown" && "bg-red-400/70",
      )}
    />
  );
}

export default function QuizListClient({ staticQuestions, category }: Props) {
  const { progress } = useQuizProgress();
  const [openId, setOpenId] = useState<string | null>(null);

  const categoryLabel =
    category === "all" ? "전체" : CATEGORY_LABELS[category as QuizCategory];

  return (
    <div className="flex min-h-screen flex-col items-center px-4 pt-20 pb-20">
      <div className="w-full max-w-lg">
        {/* top nav */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/quiz"
            className="text-sm text-text-primary/40 transition-colors hover:text-text-primary/70"
          >
            ← 목록
          </Link>
          <Link
            href={`/quiz/${category}`}
            className="text-sm text-text-primary/40 transition-colors hover:text-text-primary/70"
          >
            문제 풀기 →
          </Link>
        </div>

        {/* title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold">{categoryLabel}</h1>
          <p className="mt-0.5 text-sm text-text-primary/50">
            {staticQuestions.length}문제
          </p>
        </div>

        {/* question list */}
        <div className="flex flex-col gap-2">
          {staticQuestions.map((q) => {
            const isOpen = openId === q.id;
            const status = progress[q.id] as "known" | "unknown" | undefined;

            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-xl border transition-colors",
                  isOpen
                    ? "border-text-primary/20"
                    : "border-text-primary/10 hover:border-text-primary/20",
                )}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : q.id)}
                  className="flex w-full items-start gap-3 px-5 py-4 text-left"
                >
                  <StatusDot status={status} />

                  <div className="min-w-0 flex-1">
                    {(category === "all" || q.isAdvanced) && (
                      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                        {category === "all" && (
                          <span className="rounded-full border border-text-primary/15 px-2 py-0.5 text-xs text-text-primary/50">
                            {CATEGORY_LABELS[q.category]}
                          </span>
                        )}
                        {q.isAdvanced && (
                          <span className="rounded-full border border-text-primary/15 px-2 py-0.5 text-xs text-text-primary/40">
                            심화
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed font-medium">
                      {q.question}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "mt-0.5 flex-shrink-0 text-base leading-none text-text-primary/30 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  >
                    ↓
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-text-primary/10 px-5 pt-4 pb-5">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-text-primary/70">
                          {q.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
