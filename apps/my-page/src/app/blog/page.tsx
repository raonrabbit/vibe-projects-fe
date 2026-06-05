import type { Metadata } from "next";
import { getAllPosts } from "@/shared/lib/posts";
import { BlogList } from "@/widgets/blog-list";

export const metadata: Metadata = {
  title: "Blog",
  description: "프론트엔드 개발, 경험, 생각을 기록합니다.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    title: "Blog | 프론트엔드 포트폴리오",
    description: "프론트엔드 개발, 경험, 생각을 기록합니다.",
    url: "https://www.raonrabbit.dev/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | 프론트엔드 포트폴리오",
    description: "프론트엔드 개발, 경험, 생각을 기록합니다.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 pt-28 pb-20">
      <div className="mb-12 flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-black dark:text-white">Blog</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          프론트엔드 개발, 경험, 생각을 기록합니다.
        </p>
      </div>

      <BlogList posts={posts} />
    </main>
  );
}
