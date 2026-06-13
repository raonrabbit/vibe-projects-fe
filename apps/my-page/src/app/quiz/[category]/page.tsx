import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  CATEGORY_LABELS,
  QUIZ_QUESTIONS,
  type QuizCategory,
} from "@/shared/data/quiz-questions";

import QuizClient from "./QuizClient";
import QuizListClient from "./QuizListClient";

const VALID_CATEGORIES = [
  "all",
  "cs-basics",
  "algorithms",
  "data-structures",
  "network",
  "javascript",
  "react",
  "nextjs",
  "state-management",
  "coding",
] as const;

type ValidCategory = (typeof VALID_CATEGORIES)[number];

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label =
    category === "all"
      ? "전체"
      : (CATEGORY_LABELS[category as QuizCategory] ?? "퀴즈");
  return { title: `${label} 퀴즈`, robots: { index: false } };
}

export function generateStaticParams() {
  return VALID_CATEGORIES.map((c) => ({ category: c }));
}

export default async function QuizPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { mode } = await searchParams;

  if (!VALID_CATEGORIES.includes(category as ValidCategory)) notFound();

  const questions =
    category === "all"
      ? QUIZ_QUESTIONS
      : QUIZ_QUESTIONS.filter((q) => q.category === (category as QuizCategory));

  if (mode === "list") {
    return (
      <QuizListClient
        staticQuestions={questions}
        category={category as QuizCategory | "all"}
      />
    );
  }

  return (
    <QuizClient
      questions={questions}
      category={category as QuizCategory | "all"}
    />
  );
}
