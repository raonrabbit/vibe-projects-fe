import Link from "next/link";
import type { Post, PostMeta } from "@/entities/post";
import type { TocHeading } from "./TOC";
import { TOC } from "./TOC";
import { MdxContent } from "./MdxContent";
import { BlogNavigation } from "./BlogNavigation";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface BlogDetailProps {
  post: Post;
  headings: TocHeading[];
  prevPost: Pick<PostMeta, "slug" | "title"> | null;
  nextPost: Pick<PostMeta, "slug" | "title"> | null;
}

export function BlogDetail({
  post,
  headings,
  prevPost,
  nextPost,
}: BlogDetailProps) {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 pt-24 pb-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
        <Link
          href="/blog"
          className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Blog
        </Link>
        <span>/</span>
        <span className="text-zinc-600 dark:text-zinc-400">{post.title}</span>
      </nav>

      <div className="flex gap-16">
        {/* Article */}
        <article className="min-w-0 flex-1">
          {/* Header */}
          <header className="mb-10 border-b border-black/8 pb-10 dark:border-white/8">
            {post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-black/5 px-3 py-0.5 text-xs font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="mb-4 text-3xl leading-tight font-bold text-black md:text-4xl dark:text-white">
              {post.title}
            </h1>

            {post.description && (
              <p className="mb-6 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
                {post.description}
              </p>
            )}

            <time
              dateTime={post.date}
              className="text-sm text-zinc-400 dark:text-zinc-500"
            >
              {formatDate(post.date)}
            </time>
          </header>

          {/* MDX body */}
          <div className="prose-custom">
            <MdxContent source={post.content} />
          </div>

          <BlogNavigation prevPost={prevPost} nextPost={nextPost} />
        </article>

        {/* TOC sidebar */}
        <div className="hidden w-56 shrink-0 xl:block">
          <TOC headings={headings} />
        </div>
      </div>
    </main>
  );
}
