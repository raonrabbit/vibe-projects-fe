"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { AWARDS } from "@/entities/award";

export function AwardsSection() {
  return (
    <section className="px-6 py-20 sm:px-12 sm:py-28">
      <div className="border-b border-current/10 pb-5">
        <span className="text-[11px] tracking-[0.2em] uppercase opacity-40">
          Awards
        </span>
      </div>

      {AWARDS.map((award, i) => (
        <motion.div
          key={award.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
          className="border-b border-current/10 py-8"
        >
          <div className="flex items-start gap-6 sm:gap-12">
            <span className="w-8 shrink-0 pt-1 text-[11px] tabular-nums opacity-30">
              0{i + 1}
            </span>
            <div className="flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-xl leading-tight font-bold">
                  {award.title}
                </h3>
                <span className="shrink-0 text-[11px] tabular-nums opacity-40">
                  {award.date}
                </span>
              </div>
              <p className="mt-1 text-[11px] tracking-[0.1em] uppercase opacity-30">
                {award.organizer}
              </p>
              <p className="mt-3 text-sm leading-relaxed opacity-50">
                {award.description}
              </p>
              {award.projectId && (
                <Link
                  href={`/projects/${award.projectId}`}
                  className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase opacity-40 transition-opacity hover:opacity-80"
                >
                  View Project →
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
