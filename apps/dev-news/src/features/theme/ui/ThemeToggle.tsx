"use client";

import { cn, MoonIcon, SunIcon } from "@vibe/ui";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("theme") as "light" | "dark" | null;
        const preferred = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
        const initial = saved ?? preferred;
        setTheme(initial);
        document.documentElement.setAttribute("data-theme", initial);
    }, []);

    const toggle = () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    };

    if (!mounted) return <div className="h-9 w-9" />;

    return (
        <button
            onClick={toggle}
            aria-label="테마 전환"
            className={cn(
                "h-9 w-9 rounded-md flex items-center justify-center",
                "text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors",
            )}
        >
            {theme === "light" ? (
                <MoonIcon size={16} />
            ) : (
                <SunIcon size={16} />
            )}
        </button>
    );
}
