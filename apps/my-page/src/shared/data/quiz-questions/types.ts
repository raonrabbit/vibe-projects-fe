export type QuizCategory =
  | "cs-basics"
  | "algorithms"
  | "data-structures"
  | "network"
  | "javascript"
  | "react";

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  answer: string;
  isAdvanced?: boolean;
}

export const CATEGORY_LABELS: Record<QuizCategory, string> = {
  "cs-basics": "CS 기초",
  algorithms: "알고리즘",
  "data-structures": "자료구조",
  network: "네트워크",
  javascript: "JavaScript",
  react: "React",
};
