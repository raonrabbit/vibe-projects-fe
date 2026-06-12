import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PROJECTS } from "@/entities/project";
import {
  HighlightCard,
  ImageGallery,
  ProjectNavigation,
} from "@/widgets/project-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) return {};

  return {
    title: project.title,
    description: project.subtitle,
    alternates: {
      canonical: `/projects/${id}`,
    },
    openGraph: {
      title: project.title,
      description: project.subtitle,
      url: `https://www.raonrabbit.dev/projects/${id}`,
      images: project.images[0]
        ? [{ url: project.images[0], alt: project.title }]
        : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const projectIndex = PROJECTS.findIndex((p) => p.id === id);
  if (projectIndex === -1) notFound();

  const project = PROJECTS[projectIndex];
  const prevProject = projectIndex > 0 ? PROJECTS[projectIndex - 1] : null;
  const nextProject =
    projectIndex < PROJECTS.length - 1 ? PROJECTS[projectIndex + 1] : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "홈",
                item: "https://www.raonrabbit.dev",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: project.title,
                item: `https://www.raonrabbit.dev/projects/${id}`,
              },
            ],
          }),
        }}
      />
      <main className="min-h-screen px-6 py-16">
        <div className="mx-auto max-w-3xl">
          {/* 뒤로가기 */}
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-black dark:hover:text-white"
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
            돌아가기
          </Link>

          {/* 이미지 갤러리 */}
          <ImageGallery images={project.images} alt={project.title} />

          {/* 헤더 */}
          <div className="mt-8">
            {project.award && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                🏆 {project.award}
              </span>
            )}
            <h1 className="mt-3 text-4xl font-bold text-black dark:text-white">
              {project.title}
            </h1>
            <p className="mt-1 text-lg text-zinc-500 dark:text-zinc-400">
              {project.subtitle}
            </p>
            <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
              {project.period}
            </p>
          </div>

          {/* 기획 의도 */}
          {project.description && (
            <p className="mt-4 text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
              {project.description}
            </p>
          )}

          {/* 기술 스택 */}
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-full bg-black/6 px-3 py-1 text-sm font-medium text-zinc-600 dark:bg-white/8 dark:text-zinc-300"
              >
                {t}
              </span>
            ))}
          </div>

          {/* 구분선 */}
          <hr className="my-8 border-black/8 dark:border-white/8" />

          {/* 팀 구성 */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              팀 구성
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.team.map((t) => {
                const match = t.match(/^(.*?)\s+(\d+)$/);
                return match ? (
                  <div
                    key={t}
                    className="flex items-center gap-1.5 rounded-full bg-zinc-100 py-1 pr-1.5 pl-3 dark:bg-zinc-800"
                  >
                    <span className="text-sm text-zinc-600 dark:text-zinc-300">
                      {match[1]}
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-300 text-xs font-bold text-zinc-700 dark:bg-zinc-600 dark:text-zinc-200">
                      {match[2]}
                    </span>
                  </div>
                ) : (
                  <span
                    key={t}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {t}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 주요 기능 */}
          {project.features && project.features.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                주요 기능
              </h3>
              <ul className="mt-3 space-y-2">
                {project.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 담당 역할 */}
          <div className="mt-8">
            <h3 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              담당 역할
            </h3>
            <ul className="mt-3 space-y-3">
              {project.role.map((r, i) => {
                const colonIdx = r.indexOf(":");
                if (colonIdx === -1) {
                  return (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                      {r}
                    </li>
                  );
                }
                const category = r.slice(0, colonIdx).trim();
                const desc = r.slice(colonIdx + 1).trim();
                return (
                  <li key={i} className="flex items-baseline gap-2.5">
                    <span className="shrink-0 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {category}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {desc}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 구분선 */}
          <hr className="my-8 border-black/8 dark:border-white/8" />

          {/* 주요 성과 */}
          <h2 className="text-xl font-bold text-black dark:text-white">
            주요 성과
          </h2>
          <div className="mt-5 space-y-4">
            {project.highlights.map((h, i) => (
              <HighlightCard key={i} highlight={h} index={i} />
            ))}
          </div>

          {/* 링크 */}
          <div className="mt-10 flex flex-wrap gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
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
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-black/10 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
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
                사이트 방문
              </a>
            )}
          </div>

          {/* 이전 / 다음 프로젝트 */}
          <ProjectNavigation
            prevProject={prevProject}
            nextProject={nextProject}
          />
        </div>
      </main>
    </>
  );
}
