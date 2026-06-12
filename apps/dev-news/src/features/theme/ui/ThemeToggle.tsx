"use client";

import { useEffect, useState } from "react";

import { IconButton, MoonIcon, SunIcon } from "@/shared/ui";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initial = saved ?? preferred;

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  if (theme === null) return <div className="h-9 w-9" />;

  return (
    <IconButton aria-label="테마 전환" onClick={toggle}>
      {theme === "light" ? <MoonIcon size={16} /> : <SunIcon size={16} />}
    </IconButton>
  );
}
