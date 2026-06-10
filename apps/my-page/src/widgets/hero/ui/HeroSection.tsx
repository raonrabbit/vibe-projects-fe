"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/cn";
import { PROFILE } from "@/shared/config/profile";
import { GrowingTree } from "./GrowingTree";
import { HeroBio } from "./HeroBio";

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(PROFILE.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <section className="relative flex h-[calc(100svh-3.5rem)] min-h-[560px] flex-col justify-between overflow-hidden px-6 pt-8 pb-10 sm:px-12">
      <GrowingTree />
      {/* top meta */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-[0.2em] uppercase opacity-40">
          Frontend Developer
        </span>
        <span className="text-[11px] font-medium tracking-[0.2em] uppercase opacity-40">
          Seoul, KR — 2026
        </span>
      </div>

      {/* display name */}
      <div className="select-none">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="leading-[0.88] font-black tracking-[-0.04em]"
            style={{ fontSize: "clamp(3.5rem, 20vw, 17rem)" }}
          >
            CHOI
          </div>
          <div
            className="leading-[0.88] font-black tracking-[-0.04em]"
            style={{ fontSize: "clamp(2.2rem, 12.5vw, 10.5rem)" }}
          >
            JUNHYUK
          </div>
        </motion.div>

        <HeroBio />
      </div>

      {/* bottom links bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className="mb-5 h-px bg-current opacity-10" />
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <button
            onClick={copyEmail}
            className={cn(
              "text-[11px] tracking-[0.15em] uppercase transition-opacity",
              copied ? "opacity-60" : "opacity-40 hover:opacity-70",
            )}
          >
            {copied ? "COPIED!" : PROFILE.email}
          </button>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.15em] uppercase opacity-40 transition-opacity hover:opacity-70"
          >
            GitHub
          </a>
          <a
            href="https://drive.google.com/file/d/1BuHfXwNXS_RQ0iHGsCH6H3u_mEPVtB76/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.15em] uppercase opacity-40 transition-opacity hover:opacity-70"
          >
            Portfolio PDF
          </a>
          <span className="ml-auto text-[11px] opacity-30">최준혁</span>
        </div>
      </motion.div>
    </section>
  );
}
