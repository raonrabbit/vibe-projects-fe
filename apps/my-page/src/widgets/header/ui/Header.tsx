"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import { ThemeToggle } from "@/features/theme";
import { useActiveSection } from "@/features/active-section";

const SECTION_LINKS = [
  { id: "hero", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "awards", label: "Awards" },
  { id: "projects", label: "Projects" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeSection, scrollToSection } = useActiveSection();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";
  const isBlog = pathname.startsWith("/blog");

  const handleSectionClick = (id: string) => {
    setMobileOpen(false);
    if (isHome) {
      scrollToSection(id);
    } else {
      sessionStorage.setItem("nav_sectionId", id);
      router.push("/");
    }
  };

  const sectionLinkClass = (id: string) =>
    cn(
      "text-sm transition-colors cursor-pointer",
      isHome && activeSection === id
        ? "font-semibold text-black dark:text-white"
        : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200",
    );

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-14 border-b border-black/8 bg-bg/80 backdrop-blur-md dark:border-white/8">
      <div className="flex h-full items-center justify-between px-6 md:px-12">
        <Link
          href="/"
          className="text-sm font-semibold text-text-primary transition-opacity hover:opacity-70"
        >
          raonrabbit.dev
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {SECTION_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleSectionClick(link.id)}
              className={sectionLinkClass(link.id)}
            >
              {link.label}
            </button>
          ))}

          <span className="h-4 w-px bg-black/15 dark:bg-white/15" />

          <Link
            href="/blog"
            className={cn(
              "text-sm transition-colors",
              isBlog
                ? "font-semibold text-black dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200",
            )}
          >
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle className="h-9 w-9" />

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="메뉴"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/5 text-zinc-600 transition-colors hover:bg-black/10 md:hidden dark:bg-white/10 dark:text-zinc-400 dark:hover:bg-white/20"
          >
            {mobileOpen ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <rect y="2.5" width="16" height="1.5" rx="0.75" />
                <rect y="7.25" width="16" height="1.5" rx="0.75" />
                <rect y="12" width="16" height="1.5" rx="0.75" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-black/8 bg-bg/95 px-6 py-5 backdrop-blur-md md:hidden dark:border-white/8">
          <div className="flex flex-col items-end gap-5">
            {SECTION_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleSectionClick(link.id)}
                className={cn(
                  "cursor-pointer text-right text-sm transition-colors",
                  isHome && activeSection === link.id
                    ? "font-semibold text-black dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400",
                )}
              >
                {link.label}
              </button>
            ))}
            <div className="h-px bg-black/8 dark:bg-white/8" />
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "text-sm transition-colors",
                isBlog
                  ? "font-semibold text-black dark:text-white"
                  : "text-zinc-500 dark:text-zinc-400",
              )}
            >
              Blog
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
