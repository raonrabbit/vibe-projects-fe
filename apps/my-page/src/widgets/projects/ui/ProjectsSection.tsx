"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn, ProjectThumbnail } from "@/shared";
import { PROJECTS } from "@/entities/project";
import { PROJECTS_SECTION_MIN_H_CLASS } from "@/shared/config/sectionMinHeights";

const sectionEnter: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const RADIUS = 400;

export function ProjectsSection() {
  const [current, setCurrent] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = sessionStorage.getItem("nav_projectIndex");
    if (saved !== null) {
      sessionStorage.removeItem("nav_projectIndex");
      const idx = parseInt(saved, 10);
      if (!isNaN(idx)) return idx;
    }
    return 0;
  });
  const total = PROJECTS.length;
  const anglePerItem = 360 / total;
  const containerRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const navigateToProject = useCallback(
    (id: string) => {
      sessionStorage.setItem("nav_sectionId", "projects");
      sessionStorage.setItem("nav_projectIndex", String(current));
      router.push(`/projects/${id}`);
    },
    [current, router],
  );

  const goNext = useCallback(() => {
    setCurrent((p) => Math.min(p + 1, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent((p) => Math.max(p - 1, 0));
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top >= -10 && rect.top <= 10;
      if (!isVisible) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const rotationY = -current * anglePerItem;

  return (
    <motion.section
      ref={containerRef}
      className={`relative flex w-full flex-col justify-center gap-8 overflow-hidden ${PROJECTS_SECTION_MIN_H_CLASS}`}
      variants={sectionEnter}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="flex w-full items-center justify-center">
        <h2 className="text-4xl font-bold text-black dark:text-white">
          Projects
        </h2>
      </div>

      {/* 3D 카루셀 */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 380, perspective: "2000px" }}
      >
        <motion.div
          className="h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: rotationY }}
          transition={{ type: "spring", stiffness: 160, damping: 26 }}
        >
          {PROJECTS.map((proj, i) => {
            const cardAngle = i * anglePerItem;
            const isActive = i === current;
            return (
              <div
                key={proj.id}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 720,
                  marginLeft: -360,
                  marginTop: -128,
                  transform: `rotateY(${cardAngle}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: "hidden",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <div className="flex w-full items-center gap-8">
                  {/* 썸네일 */}
                  <div
                    className="group relative shrink-0 cursor-pointer"
                    onClick={() => navigateToProject(proj.id)}
                  >
                    <ProjectThumbnail
                      src={proj.images[0]}
                      alt={proj.title}
                      className="h-64 w-96 rounded-2xl"
                      sizes="384px"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                      <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        자세히 보기
                      </span>
                    </div>
                  </div>

                  {/* 텍스트 */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                        {proj.period}
                      </p>
                      <h2
                        className="mt-1 cursor-pointer text-3xl font-bold text-black hover:underline dark:text-white"
                        onClick={() => navigateToProject(proj.id)}
                      >
                        {proj.title}
                      </h2>
                      {proj.award && (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          🏆 {proj.award}
                        </span>
                      )}
                      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                        {proj.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-black/6 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-white/8 dark:text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {proj.github && (
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-black dark:hover:text-white"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </a>
                      )}
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-black dark:hover:text-white"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          사이트
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* 하단 컨트롤 바 */}
      <div className="flex w-full items-center justify-center px-4 sm:px-8">
        <div className="flex w-full max-w-3xl items-center justify-center gap-4 sm:justify-between">
          {/* 인디케이터 */}
          <div className="flex items-center gap-1">
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`프로젝트 ${i + 1}`}
                className="flex h-12 w-12 cursor-pointer items-center justify-center"
              >
                <motion.div
                  className={cn(
                    "rounded-full",
                    i === current
                      ? "bg-black dark:bg-white"
                      : "bg-black/20 dark:bg-white/20",
                  )}
                  animate={{ width: i === current ? 24 : 8, height: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </button>
            ))}
          </div>

          {/* 화살표 버튼 */}
          <div className="flex items-center gap-1">
            <motion.button
              onClick={goPrev}
              aria-label="이전 프로젝트"
              className={cn(
                "flex h-12 w-12 cursor-pointer items-center justify-center rounded-full",
                "bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20",
                "text-zinc-600 transition-colors dark:text-zinc-400",
              )}
              animate={{
                opacity: current > 0 ? 1 : 0.2,
                pointerEvents: current > 0 ? "auto" : "none",
              }}
              transition={{ duration: 0.2 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>
            <motion.button
              onClick={goNext}
              aria-label="다음 프로젝트"
              className={cn(
                "flex h-12 w-12 cursor-pointer items-center justify-center rounded-full",
                "bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20",
                "text-zinc-600 transition-colors dark:text-zinc-400",
              )}
              animate={{
                opacity: current < total - 1 ? 1 : 0.2,
                pointerEvents: current < total - 1 ? "auto" : "none",
              }}
              transition={{ duration: 0.2 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
