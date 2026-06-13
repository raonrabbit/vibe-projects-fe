import { Metadata } from "next";
import Link from "next/link";

import {
  CATEGORY_LABELS,
  QUIZ_QUESTIONS,
  type QuizCategory,
} from "@/shared/data/quiz-questions";

export const metadata: Metadata = {
  title: "CS 퀴즈",
  robots: { index: false },
};

const CATEGORIES: QuizCategory[] = [
  "cs-basics",
  "algorithms",
  "data-structures",
  "network",
  "javascript",
  "react",
  "nextjs",
  "state-management",
  "coding",
];

export default function QuizIndexPage() {
  const counts = Object.fromEntries(
    CATEGORIES.map((cat) => [
      cat,
      QUIZ_QUESTIONS.filter((q) => q.category === cat).length,
    ]),
  );
  const total = QUIZ_QUESTIONS.length;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-text-primary/40 transition-colors hover:text-text-primary/70"
        >
          ← 메인으로
        </Link>

        <h1 className="mb-1 text-2xl font-bold">CS 면접 퀴즈</h1>
        <p className="mb-8 text-sm text-text-primary/50">
          문제를 풀고 알았다 / 몰랐다로 체크해보세요.
        </p>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-text-primary/10 px-5 py-4">
            <div className="mb-3">
              <p className="font-semibold">전체</p>
              <p className="mt-0.5 text-xs text-text-primary/50">
                {total}문제 · 랜덤 순서
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/quiz/all?mode=list"
                className="flex-1 rounded-lg border border-text-primary/15 py-2 text-center text-xs text-text-primary/60 transition-colors hover:border-text-primary/40"
              >
                목록 보기
              </Link>
              <Link
                href="/quiz/all"
                className="flex-1 rounded-lg border border-text-primary/15 py-2 text-center text-xs text-text-primary/60 transition-colors hover:border-text-primary/40"
              >
                문제 풀기
              </Link>
            </div>
          </div>

          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="rounded-xl border border-text-primary/10 px-5 py-4"
            >
              <div className="mb-3">
                <p className="font-semibold">{CATEGORY_LABELS[cat]}</p>
                <p className="mt-0.5 text-xs text-text-primary/50">
                  {counts[cat]}문제
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/quiz/${cat}?mode=list`}
                  className="flex-1 rounded-lg border border-text-primary/15 py-2 text-center text-xs text-text-primary/60 transition-colors hover:border-text-primary/40"
                >
                  목록 보기
                </Link>
                <Link
                  href={`/quiz/${cat}`}
                  className="flex-1 rounded-lg border border-text-primary/15 py-2 text-center text-xs text-text-primary/60 transition-colors hover:border-text-primary/40"
                >
                  문제 풀기
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
