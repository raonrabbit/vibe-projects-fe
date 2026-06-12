export type { QuizCategory, QuizQuestion } from "./types";
export { CATEGORY_LABELS } from "./types";

import { ALGORITHMS_QUESTIONS } from "./algorithms";
import { CODING_QUESTIONS } from "./coding";
import { CS_BASICS_QUESTIONS } from "./cs-basics";
import { DATA_STRUCTURES_QUESTIONS } from "./data-structures";
import { JAVASCRIPT_QUESTIONS } from "./javascript";
import { NETWORK_QUESTIONS } from "./network";
import { REACT_QUESTIONS } from "./react";

export const QUIZ_QUESTIONS = [
  ...CS_BASICS_QUESTIONS,
  ...ALGORITHMS_QUESTIONS,
  ...DATA_STRUCTURES_QUESTIONS,
  ...NETWORK_QUESTIONS,
  ...JAVASCRIPT_QUESTIONS,
  ...REACT_QUESTIONS,
  ...CODING_QUESTIONS,
];
