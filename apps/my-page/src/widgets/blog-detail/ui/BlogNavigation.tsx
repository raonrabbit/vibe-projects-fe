import Link from "next/link";

import type { PostMeta } from "@/entities/post";

interface BlogNavigationProps {
  prevPost: Pick<PostMeta, "slug" | "title"> | null;
  nextPost: Pick<PostMeta, "slug" | "title"> | null;
}

export function BlogNavigation({ prevPost, nextPost }: BlogNavigationProps) {
  return (
    <div className="mt-16 border-t border-black/8 pt-8 dark:border-white/8">
      <div className="flex gap-4">
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="flex flex-1 flex-col gap-1 rounded-xl p-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              ← 이전 글
            </span>
            <span className="text-sm font-medium text-black dark:text-white">
              {prevPost.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="flex flex-1 flex-col items-end gap-1 rounded-xl p-4 text-right transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              다음 글 →
            </span>
            <span className="text-sm font-medium text-black dark:text-white">
              {nextPost.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
