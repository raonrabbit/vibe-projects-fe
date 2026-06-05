"use client";

import { cn } from "@/shared/lib/cn";

interface TagFilterProps {
  tags: string[];
  selected: string | null;
  onChange: (tag: string | null) => void;
}

export function TagFilter({ tags, selected, onChange }: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          selected === null
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "bg-black/5 text-zinc-600 hover:bg-black/10 dark:bg-white/10 dark:text-zinc-400 dark:hover:bg-white/15",
        )}
      >
        전체
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(tag === selected ? null : tag)}
          className={cn(
            "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            selected === tag
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-black/5 text-zinc-600 hover:bg-black/10 dark:bg-white/10 dark:text-zinc-400 dark:hover:bg-white/15",
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
