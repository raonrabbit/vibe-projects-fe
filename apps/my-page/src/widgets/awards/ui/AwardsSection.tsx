"use client";

import { motion, type Variants } from "framer-motion";
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

export function AwardsSection() {
  return (
    <section
      className={`flex ${AWARDS_SECTION_MIN_H_CLASS} flex-col items-center justify-center px-6 py-12`}
    >
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
              className="group flex flex-col gap-3 rounded-2xl bg-black/[0.03] p-5 transition-colors hover:bg-black/[0.05] sm:p-6 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
            >
              <span className="w-fit rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-400">
                {award.date}
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-black dark:text-white">
                  {award.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                  {award.organizer}
                </p>
              </div>
              <div className="h-px bg-black/[0.06] dark:bg-white/[0.06]" />
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {award.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
