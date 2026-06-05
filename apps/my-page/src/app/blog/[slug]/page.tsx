import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPosts,
  getPostBySlug,
  extractHeadings,
} from "@/shared/lib/posts";
import { BlogDetail } from "@/widgets/blog-detail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `https://www.raonrabbit.dev/blog/${slug}`;
  const images = post.thumbnail ? [{ url: post.thumbnail }] : [];

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      images,
      publishedTime: post.date,
      authors: ["최준혁"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.draft) notFound();

  const allPosts = getAllPosts();
  const idx = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = idx < allPosts.length - 1 ? allPosts[idx + 1] : null;
  const nextPost = idx > 0 ? allPosts[idx - 1] : null;
  const headings = extractHeadings(post.content);

  return (
    <BlogDetail
      post={post}
      headings={headings}
      prevPost={prevPost}
      nextPost={nextPost}
    />
  );
}
