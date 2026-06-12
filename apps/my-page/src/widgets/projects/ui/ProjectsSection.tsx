"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { type Project, PROJECTS } from "@/entities/project";

function ProjectCard({
  project,
  index,
  onClick,
  className = "",
  large = false,
}: {
  project: Project;
  index: number;
  onClick: () => void;
  className?: string;
  large?: boolean;
}) {
  return (
    <motion.div
      className={`group relative cursor-pointer overflow-hidden bg-zinc-200 dark:bg-zinc-800 ${large ? "aspect-[4/3] sm:aspect-auto" : "aspect-[4/3]"} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
    >
      <Image
        src={project.images[0]}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes={
          large
            ? "(max-width: 640px) 100vw, 66vw"
            : "(max-width: 640px) 100vw, 33vw"
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className={`absolute bottom-0 left-0 ${large ? "p-6" : "p-4"}`}>
        <p
          className={`font-medium tracking-[0.15em] text-white/50 uppercase ${large ? "text-xs" : "text-[10px]"}`}
        >
          {String(index + 1).padStart(2, "0")} — {project.period}
        </p>
        <h3
          className={`mt-1 font-bold text-white ${large ? "text-2xl" : "text-sm"}`}
        >
          {project.title}
        </h3>
        {project.award && (
          <p
            className={`mt-1 text-amber-300 ${large ? "text-xs" : "text-[10px]"}`}
          >
            {project.award}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const router = useRouter();

  const navigate = useCallback(
    (id: string) => {
      sessionStorage.setItem("nav_sectionId", "projects");
      router.push(`/projects/${id}`);
    },
    [router],
  );

  const [p0, p1, p2, p3] = PROJECTS;

  return (
    <section className="px-6 py-20 sm:px-12 sm:py-28">
      <div className="mb-8 border-b border-current/10 pb-5">
        <span className="text-[11px] tracking-[0.2em] uppercase opacity-40">
          Projects
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ProjectCard
          project={p0}
          index={0}
          onClick={() => navigate(p0.id)}
          className="sm:col-span-2 sm:row-span-2"
          large
        />
        <ProjectCard project={p1} index={1} onClick={() => navigate(p1.id)} />
        <ProjectCard project={p2} index={2} onClick={() => navigate(p2.id)} />
        <ProjectCard project={p3} index={3} onClick={() => navigate(p3.id)} />
        <div className="hidden items-end p-2 opacity-30 sm:col-span-2 sm:flex">
          <p className="text-xs leading-relaxed tracking-wide">
            사용자 경험을 중심으로 다양한 프로젝트를 개발했습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
