"use client";

import { motion, type Variants } from "framer-motion";
import { AWARDS } from "@/entities/award";

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

export function AwardsSection() {
  return (
    <section className="flex h-screen flex-col items-center justify-center px-6">
      <motion.div
        className="w-full max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={container}
      >
        {/* 상단 SSAFY 소개 텍스트 */}
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

        {/* 수상 카드 3개 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {AWARDS.map((award) => (
            <motion.div
              key={award.id}
              variants={item}
              className="group rounded-2xl border border-black/8 bg-black/3 p-6 transition-colors hover:bg-black/6 dark:border-white/8 dark:bg-white/3 dark:hover:bg-white/6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/8 dark:bg-white/8">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black/60 dark:text-white/60"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {award.date}
                </span>
              </div>
              <h3 className="text-base font-semibold text-black dark:text-white">
                {award.title}
              </h3>
              <p className="mt-1 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                {award.organizer}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {award.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
