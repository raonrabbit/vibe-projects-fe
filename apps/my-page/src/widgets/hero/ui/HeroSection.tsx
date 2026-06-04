"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/shared/lib/cn";
import { PROFILE } from "@/shared/config/profile";
import { HERO_SECTION_MIN_H_CLASS } from "@/shared/config/sectionMinHeights";

function TypingText() {
  const texts = PROFILE.typingTexts;
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && display === current) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && display === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % texts.length);
      }, 0);
    } else if (isDeleting) {
      timeout = setTimeout(() => setDisplay((prev) => prev.slice(0, -1)), 50);
    } else {
      timeout = setTimeout(
        () => setDisplay((prev) => current.slice(0, prev.length + 1)),
        100,
      );
    }

    return () => clearTimeout(timeout);
  }, [display, isDeleting, index, texts]);

  return (
    <span>
      {display}
      <span className="animate-pulse">|</span>
    </span>
  );
}

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(PROFILE.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <section
      className={`flex ${HERO_SECTION_MIN_H_CLASS} items-center justify-center px-6 py-16 sm:py-24`}
    >
      <motion.div
        className="flex flex-col items-center gap-10 text-center md:flex-row md:items-center md:gap-20 md:text-left"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item} className="shrink-0">
          <div className="relative h-44 w-44 overflow-hidden rounded-full ring-2 ring-black/10 md:h-56 md:w-56 dark:ring-white/10">
            <Image
              src={PROFILE.photo}
              alt={PROFILE.name}
              fill
              className="object-cover"
              priority
              fetchPriority="high"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div
              className={cn(
                "flex h-full w-full items-center justify-center",
                "bg-zinc-100 text-4xl font-bold text-zinc-400",
                "dark:bg-zinc-800 dark:text-zinc-500",
              )}
            >
              JH
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-3">
          <motion.p
            variants={item}
            className="text-xs font-semibold tracking-widest text-zinc-600 uppercase dark:text-zinc-400"
          >
            Hello, I&apos;m
          </motion.p>

          <motion.h1
            variants={item}
            className="text-5xl font-bold tracking-tight text-black md:text-6xl dark:text-white"
          >
            {PROFILE.name}
          </motion.h1>

          <motion.p
            variants={item}
            className="h-8 text-xl text-zinc-500 dark:text-zinc-400"
          >
            <TypingText />
          </motion.p>

          <motion.div
            variants={item}
            className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-5 md:items-start md:justify-start"
          >
            <button
              onClick={copyEmail}
              className={cn(
                "flex cursor-pointer items-center gap-2 text-sm font-medium",
                "transition-colors",
                copied
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white",
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              {copied ? "복사됨!" : PROFILE.email}
            </button>

            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 text-sm font-medium",
                "text-zinc-600 transition-colors hover:text-black",
                "dark:text-zinc-400 dark:hover:text-white",
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>

            <a
              href="https://drive.google.com/file/d/1BuHfXwNXS_RQ0iHGsCH6H3u_mEPVtB76/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 text-sm font-medium",
                "text-zinc-600 transition-colors hover:text-black",
                "dark:text-zinc-400 dark:hover:text-white",
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <path d="M2 10h20" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
              Portfolio
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
