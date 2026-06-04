"use client";

import { cn } from "@/shared/lib/cn";
import { MoonIcon, SunIcon } from "@/shared/ui/ThemeIcons";
import { useTheme } from "@/shared/lib/useTheme";

export function ThemeToggle() {
  const { theme, toggle, mounted } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="테마 토글"
      className={cn(
        "fixed top-4 right-4 z-50",
        "flex h-12 w-12 items-center justify-center rounded-full",
        "bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20",
        "text-zinc-600 transition-colors duration-200 dark:text-zinc-400",
        "cursor-pointer",
      )}
    >
      {mounted &&
        (theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />)}
    </button>
  );
}
