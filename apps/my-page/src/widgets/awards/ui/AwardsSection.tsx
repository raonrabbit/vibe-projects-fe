"use client";

import { useState, useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { AWARDS } from "@/entities/award";
import { AWARDS_SECTION_MIN_H_CLASS } from "@/shared/config/sectionMinHeights";

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

function CardBorderLight({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 rounded-2xl transition-opacity duration-700 ${
        isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      {/* 카드 전체를 덮는 기본 glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(253,224,60,0.45) 0%, rgba(251,191,36,0.15) 55%, transparent 75%)",
          filter: "blur(14px)",
        }}
        animate={{
          scale: [1, 1.06, 0.95, 1.03, 1],
          opacity: [0.55, 1, 0.45, 0.85, 0.55],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* 밝은 핫스팟 — 중심 이동 */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,252,180,0.8) 0%, rgba(255,230,80,0.2) 50%, transparent 72%)",
          filter: "blur(8px)",
        }}
        animate={{
          x: [-10, 14, -16, 8, -10],
          y: [-6, 10, -12, 4, -6],
          opacity: [0.7, 0.3, 0.9, 0.45, 0.7],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
      {/* 좌 난반사 */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 20% 50%, rgba(255,240,100,0.5) 0%, transparent 65%)",
          filter: "blur(12px)",
        }}
        animate={{
          x: [-12, 20, -8, 24, -12],
          opacity: [0.3, 0.65, 0.22, 0.55, 0.3],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      />
      {/* 우 난반사 */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse 65% 65% at 80% 50%, rgba(253,220,80,0.45) 0%, transparent 62%)",
          filter: "blur(12px)",
        }}
        animate={{
          x: [10, -18, 14, -22, 10],
          opacity: [0.25, 0.6, 0.18, 0.5, 0.25],
        }}
        transition={{
          duration: 7.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      {/* 플리커 */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 50% 50%, rgba(255,255,210,0.9) 0%, transparent 60%)",
          filter: "blur(5px)",
        }}
        animate={{ opacity: [0.6, 0.05, 0.85, 0.08, 0.75, 0.03, 0.6] }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.7,
        }}
      />
    </div>
  );
}

export function AwardsSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  function handleCardClick(id: string) {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(hover: hover)").matches
    ) {
      setOpenId((prev) => (prev === id ? null : id));
    }
  }

  useEffect(() => {
    function handleOutside(e: PointerEvent) {
      if (
        sectionRef.current &&
        !sectionRef.current.contains(e.target as Node)
      ) {
        setOpenId(null);
      }
    }
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`flex ${AWARDS_SECTION_MIN_H_CLASS} flex-col items-center justify-center px-6 py-12`}
    >
      <motion.div
        className="w-full max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={container}
      >
        <motion.div variants={item} className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-black dark:text-white">
            Awards
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            삼성 청년 SW 아카데미(SSAFY) 12기를 수료하며 다양한 프로젝트와
            <br className="hidden sm:block" />
            협업 경험을 통해 역량을 쌓았습니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-3">
          {AWARDS.map((award) => {
            const isOpen = openId === award.id;
            return (
              <motion.div
                key={award.id}
                variants={item}
                className="group relative cursor-pointer"
                onMouseEnter={() => setOpenId(award.id)}
                onMouseLeave={() => setOpenId(null)}
                onClick={() => handleCardClick(award.id)}
              >
                <CardBorderLight isOpen={isOpen} />

                <div className="relative z-10 flex flex-col gap-3 rounded-2xl bg-zinc-100/70 p-5 backdrop-blur-md sm:p-6 dark:bg-zinc-900/60">
                  <div>
                    <h3 className="text-[15px] font-bold text-black dark:text-white">
                      {award.title}
                    </h3>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {award.organizer}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {award.date}
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-black/[0.06] dark:bg-white/[0.06]" />
                  <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {award.description}
                  </p>

                  {award.projectId && (
                    <div
                      className={`transition-opacity duration-150 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/projects/${award.projectId}`}
                        tabIndex={isOpen ? 0 : -1}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-300/60 bg-zinc-200/40 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200/70 dark:border-zinc-700/60 dark:bg-zinc-800/40 dark:text-zinc-400 dark:hover:bg-zinc-700/40"
                      >
                        프로젝트 바로가기
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M2.5 7h9M8 3.5 11.5 7 8 10.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
