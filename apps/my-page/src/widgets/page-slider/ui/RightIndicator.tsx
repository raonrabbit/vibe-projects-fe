"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/lib/cn";

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

export function RightIndicator({
  total,
  current,
  sections,
  onDotClick,
}: RightIndicatorProps) {
  return (
    <div className="fixed top-1/2 right-6 z-50 flex -translate-y-1/2 flex-col items-center gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={sections[i].label}
          className="group relative flex cursor-pointer flex-row items-center"
        >
          <span
            className={cn(
              "absolute right-4 text-xs font-medium whitespace-nowrap",
              "text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-400",
            )}
          >
            {sections[i].label}
          </span>
          <motion.div
            className={cn(
              "rounded-full",
              i === current
                ? "bg-black dark:bg-white"
                : "bg-black/20 hover:bg-black/40 dark:bg-white/20 dark:hover:bg-white/40",
            )}
            animate={{
              width: 8,
              height: i === current ? 24 : 8,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </button>
      ))}
    </div>
  );
}
