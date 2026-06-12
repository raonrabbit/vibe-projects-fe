"use client";

import { useCallback, useState } from "react";

import type { QuizCategory } from "@/shared/data/quiz-questions";

type QuestionResult = "known" | "unknown";

type ProgressMap = Record<string, QuestionResult>;

const STORAGE_KEY = "quiz-progress";

function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function saveProgress(map: ProgressMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // storage quota exceeded — silently ignore
  }
}

export function useQuizProgress() {
  const [progress, setProgress] = useState<ProgressMap>(loadProgress);

  const mark = useCallback((id: string, result: QuestionResult) => {
    setProgress((prev) => {
      const next = { ...prev, [id]: result };
      saveProgress(next);
      return next;
    });
  }, []);

  const resetCategory = useCallback((category: QuizCategory | "all") => {
    setProgress((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        if (category === "all" || id.startsWith(category.split("-")[0])) {
          delete next[id];
        }
      });
      saveProgress(next);
      return next;
    });
  }, []);

  const getStats = useCallback(
    (ids: string[]) => {
      const known = ids.filter((id) => progress[id] === "known").length;
      const unknown = ids.filter((id) => progress[id] === "unknown").length;
      return { known, unknown, total: ids.length };
    },
    [progress],
  );

  return { progress, mark, resetCategory, getStats };
}
