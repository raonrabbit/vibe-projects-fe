"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { SKILL_CATEGORIES } from "@/entities/skill";

const allSkillItems = SKILL_CATEGORIES.flatMap((sc) =>
  sc.skills.map((s) => ({ ...s, category: sc.category })),
);
const allNames = allSkillItems.map((s) => s.name);
const reversedNames = [...allNames].reverse();

const wx = (i: number) => Math.cos(i * 1.7) * 11;
const wy = (i: number) => Math.sin(i * 2.3) * 11;

type Mode = "marquee" | "grid";

// ResizeObserver로 내부 높이를 측정 후 useSpring으로 부드럽게 추종
function AnimateHeight({ children }: { children: React.ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const rawHeight = useMotionValue(0);
  const springHeight = useSpring(rawHeight, {
    stiffness: 200,
    damping: 26,
    restDelta: 0.5,
  });
  const initialized = useRef(false);

  // 첫 렌더에서 height를 페인트 전에 즉시 세팅 (spring 점프, 애니메이션 없이)
  useLayoutEffect(() => {
    if (!innerRef.current) return;
    const h = innerRef.current.offsetHeight;
    rawHeight.set(h);
    springHeight.set(h);
    initialized.current = true;
  }, []);

  // 이후 컨텐츠 변화는 ResizeObserver로 감지 → spring이 따라감
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (initialized.current) {
        rawHeight.set(entry.contentRect.height);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [rawHeight]);

  return (
    <motion.div style={{ height: springHeight, overflow: "hidden" }}>
      <div ref={innerRef}>{children}</div>
    </motion.div>
  );
}

export function SkillsSection() {
  const [mode, setMode] = useState<Mode>("marquee");

  return (
    <section className="border-y border-current/10 py-20 sm:py-28">
      {/* 헤더 */}
      <div className="mb-10 flex items-center justify-between px-6 sm:px-12">
        <span className="text-[11px] tracking-[0.2em] uppercase opacity-40">
          Skills
        </span>

        {/* 드롭다운 버튼 */}
        <button
          onClick={() => setMode((m) => (m === "marquee" ? "grid" : "marquee"))}
          className="group flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-current/20 transition-all hover:border-current/50 hover:bg-current/8"
          aria-label="toggle skills view"
        >
          <motion.svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            animate={{ rotate: mode === "grid" ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="opacity-50 transition-opacity group-hover:opacity-80"
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </button>
      </div>

      {/* 컨텐츠 — 높이 변화를 spring으로 애니메이션 */}
      <AnimateHeight>
        <AnimatePresence mode="wait" initial={false}>
          {mode === "marquee" ? (
            <motion.div
              key="marquee"
              initial={{ opacity: 0, filter: "blur(14px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(18px)", scale: 1.02 }}
              transition={{ duration: 0.42, ease: "easeInOut" }}
            >
              <motion.div
                className="flex overflow-x-clip"
                initial={{ x: -40 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0, 0.2, 1] }}
              >
                <div
                  className="flex shrink-0"
                  style={{
                    animation: "marquee 70s linear infinite",
                    willChange: "transform",
                  }}
                >
                  {[...allNames, ...allNames].map((name, i) => (
                    <span
                      key={i}
                      className="mr-10 text-5xl font-black tracking-tight whitespace-nowrap opacity-[0.18]"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="mt-3 flex overflow-x-clip"
                initial={{ x: 40 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0, 0.2, 1] }}
              >
                <div
                  className="flex shrink-0"
                  style={{
                    animation: "marquee-reverse 90s linear infinite",
                    willChange: "transform",
                  }}
                >
                  {[...reversedNames, ...reversedNames].map((name, i) => (
                    <span
                      key={i}
                      className="mr-10 text-4xl font-black tracking-tight whitespace-nowrap opacity-[0.13]"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-2 gap-x-6 gap-y-8 px-6 sm:grid-cols-3 sm:px-12 lg:grid-cols-6"
              initial="hidden"
              animate="visible"
              exit={{
                opacity: 0,
                filter: "blur(18px)",
                scale: 1.02,
                transition: { duration: 0.38 },
              }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.03 } },
              }}
            >
              {SKILL_CATEGORIES.map((sc) => (
                <motion.div
                  key={sc.category}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.025 } },
                  }}
                >
                  <motion.p
                    className="mb-3 text-[10px] tracking-[0.2em] uppercase"
                    variants={{
                      hidden: { opacity: 0, filter: "blur(6px)", y: 8 },
                      visible: {
                        opacity: 0.3,
                        filter: "blur(0px)",
                        y: 0,
                        transition: { duration: 0.45, ease: "easeOut" },
                      },
                    }}
                  >
                    {sc.category}
                  </motion.p>
                  <ul className="space-y-1.5">
                    {sc.skills.map((skill) => {
                      const idx = allSkillItems.findIndex(
                        (s) => s.slug === skill.slug,
                      );
                      return (
                        <motion.li
                          key={skill.slug}
                          className="text-sm"
                          variants={{
                            hidden: {
                              opacity: 0,
                              filter: "blur(10px)",
                              x: wx(idx),
                              y: wy(idx),
                            },
                            visible: {
                              opacity: 0.6,
                              filter: "blur(0px)",
                              x: 0,
                              y: 0,
                              transition: {
                                type: "spring",
                                stiffness: 210,
                                damping: 20,
                              },
                            },
                          }}
                        >
                          {skill.name}
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </AnimateHeight>
    </section>
  );
}
