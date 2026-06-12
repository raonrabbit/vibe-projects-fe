"use client";

import { cn } from "@/shared/lib/cn";
import { MoonIcon, SunIcon } from "@/shared/ui/ThemeIcons";

import { useTheme } from "../model/useTheme";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle, mounted } = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    if (typeof document.startViewTransition !== "function") {
      toggle();
      return;
    }

    const transition = document.startViewTransition(toggle);
    transition.ready.then(() => {
      document.documentElement.animate(
        [
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${maxRadius}px at ${x}px ${y}px)` },
        ],
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="테마 토글"
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-full",
        "bg-black/5 text-zinc-600 transition-colors duration-200 hover:bg-black/10",
        "dark:bg-white/10 dark:text-zinc-400 dark:hover:bg-white/20",
        className,
      )}
    >
      {mounted &&
        (theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />)}
    </button>
  );
}
