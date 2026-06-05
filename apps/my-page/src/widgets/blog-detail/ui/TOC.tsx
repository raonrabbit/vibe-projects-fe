"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

const HEADER_OFFSET = 96;

export function TOC({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const isClickScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const highlightedElRef = useRef<HTMLElement | null>(null);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrollingRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (asideRef.current?.contains(e.target as Node)) return;
      if (highlightedElRef.current) {
        highlightedElRef.current.classList.remove("heading-highlight");
        highlightedElRef.current = null;
      }
    };
    document.addEventListener("click", handleDocClick);
    return () => {
      document.removeEventListener("click", handleDocClick);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);

    const el = document.getElementById(id);
    if (!el) return;

    highlightedElRef.current?.classList.remove("heading-highlight");
    el.classList.add("heading-highlight");
    highlightedElRef.current = el;

    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    isClickScrollingRef.current = true;
    window.scrollTo({ top, behavior: "smooth" });

    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 1000);
  };

  if (headings.length === 0) return null;

  return (
    <aside ref={asideRef} className="sticky top-24 hidden xl:block">
      <p className="mb-3 text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        목차
      </p>
      <nav>
        <ul className="space-y-2 border-l border-black/8 dark:border-white/8">
          {headings.map(({ id, text, level }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className={cn(
                  "block border-l-2 py-0.5 pl-4 text-sm leading-snug transition-colors",
                  level === 3 && "pl-7",
                  activeId === id
                    ? "border-black font-medium text-black dark:border-white dark:text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300",
                )}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
