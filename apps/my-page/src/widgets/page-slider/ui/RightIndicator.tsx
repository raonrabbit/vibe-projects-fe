"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/lib/cn";
import { PAGE_INDICATOR_LABEL_CLASS } from "../indicatorGutter";

export interface SliderSection {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface RightIndicatorProps {
  total: number;
  current: number;
  sections: SliderSection[];
  onDotClick: (index: number) => void;
}

const INDICATOR_LABEL_SIZE = "0.875rem";
const INDICATOR_LABEL_SCALE_INACTIVE = 10 / 14;

const indicatorTransition = {
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1] as const,
};

export function RightIndicator({
  total,
  current,
  sections,
  onDotClick,
}: RightIndicatorProps) {
  return (
    <div className="fixed top-1/2 right-6 z-50 flex -translate-y-1/2 flex-col items-end gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={sections[i].label}
          className="group flex h-12 cursor-pointer items-center gap-0 md:gap-3"
        >
          <span
            className={cn(PAGE_INDICATOR_LABEL_CLASS, "min-w-13 justify-end")}
          >
            <motion.span
              className={cn(
                "inline-block origin-right font-medium whitespace-nowrap",
                i === current
                  ? "text-zinc-800 dark:text-zinc-100"
                  : "text-zinc-600 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200",
              )}
              style={{ fontSize: INDICATOR_LABEL_SIZE }}
              animate={{
                scale: i === current ? 1 : INDICATOR_LABEL_SCALE_INACTIVE,
              }}
              transition={indicatorTransition}
            >
              {sections[i].label}
            </motion.span>
          </span>
          <motion.div
            className={cn(
              "shrink-0 rounded-full",
              i === current
                ? "bg-black dark:bg-white"
                : "bg-black/20 hover:bg-black/40 dark:bg-white/20 dark:hover:bg-white/40",
            )}
            animate={{
              width: 8,
              height: i === current ? 24 : 8,
            }}
            transition={indicatorTransition}
          />
        </button>
      ))}
    </div>
  );
}
