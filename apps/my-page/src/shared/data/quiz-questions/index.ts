export type { QuizCategory, QuizQuestion } from "./types";
export { CATEGORY_LABELS } from "./types";

import { CS_BASICS_QUESTIONS } from "./cs-basics";
import { ALGORITHMS_QUESTIONS } from "./algorithms";
import { DATA_STRUCTURES_QUESTIONS } from "./data-structures";
import { NETWORK_QUESTIONS } from "./network";
import { JAVASCRIPT_QUESTIONS } from "./javascript";
import { REACT_QUESTIONS } from "./react";

export const QUIZ_QUESTIONS = [
  ...CS_BASICS_QUESTIONS,
  ...ALGORITHMS_QUESTIONS,
  ...DATA_STRUCTURES_QUESTIONS,
  ...NETWORK_QUESTIONS,
  ...JAVASCRIPT_QUESTIONS,
  ...REACT_QUESTIONS,
];
