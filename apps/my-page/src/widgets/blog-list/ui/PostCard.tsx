import Image from "next/image";
import Link from "next/link";

import type { PostMeta } from "@/entities/post";
import { cn } from "@/shared/lib/cn";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-0 border-b border-black/8 py-10 transition-colors first:border-t md:flex-row md:gap-10 dark:border-white/8"
    >
      {post.thumbnail && (
        <div className="relative mb-5 h-52 w-full shrink-0 overflow-hidden rounded-xl md:mb-0 md:h-44 md:w-72">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex flex-col gap-3">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h2 className="text-xl font-bold text-black transition-colors group-hover:text-zinc-700 dark:text-white dark:group-hover:text-zinc-300">
            {post.title}
          </h2>

          {post.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {post.description}
            </p>
          )}
        </div>

        <time
          dateTime={post.date}
          className="text-xs text-zinc-400 dark:text-zinc-500"
        >
          {formatDate(post.date)}
        </time>
      </div>
    </Link>
  );
}

export function PostCardSkeleton({
  hasThumbnail = true,
}: {
  hasThumbnail?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0 border-b border-black/8 py-10 first:border-t dark:border-white/8",
        "md:flex-row md:gap-10",
      )}
    >
      {hasThumbnail && (
        <div className="mb-5 h-52 w-full shrink-0 animate-pulse rounded-xl bg-black/5 md:mb-0 md:h-44 md:w-72 dark:bg-white/5" />
      )}
      <div className="flex flex-1 flex-col gap-3">
        <div className="h-4 w-24 animate-pulse rounded bg-black/5 dark:bg-white/5" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-black/5 dark:bg-white/5" />
        <div className="h-4 w-full animate-pulse rounded bg-black/5 dark:bg-white/5" />
        <div className="mt-2 h-3 w-20 animate-pulse rounded bg-black/5 dark:bg-white/5" />
      </div>
    </div>
  );
}
