"use client";

import { useRouter } from "next/navigation";
import { PROJECTS } from "@/entities/project";

interface NavProject {
  id: string;
  title: string;
}

interface Props {
  prevProject: NavProject | null;
  nextProject: NavProject | null;
}

export function ProjectNavigation({ prevProject, nextProject }: Props) {
  const router = useRouter();

  const navigate = (id: string) => {
    const index = PROJECTS.findIndex((p) => p.id === id);
    if (index !== -1) {
      sessionStorage.setItem("nav_sectionId", "projects");
      sessionStorage.setItem("nav_projectIndex", String(index));
    }
    router.push(`/projects/${id}`);
  };

  return (
    <div className="mt-16 border-t border-black/8 pt-8 dark:border-white/8">
      <div className="flex gap-4">
        {prevProject ? (
          <button
            onClick={() => navigate(prevProject.id)}
            className="flex flex-1 cursor-pointer flex-col gap-1 rounded-xl p-4 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              ← 이전 프로젝트
            </span>
            <span className="text-sm font-medium text-black dark:text-white">
              {prevProject.title}
            </span>
          </button>
        ) : (
          <div className="flex-1" />
        )}

        {nextProject ? (
          <button
            onClick={() => navigate(nextProject.id)}
            className="flex flex-1 cursor-pointer flex-col items-end gap-1 rounded-xl p-4 text-right transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              다음 프로젝트 →
            </span>
            <span className="text-sm font-medium text-black dark:text-white">
              {nextProject.title}
            </span>
          </button>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
