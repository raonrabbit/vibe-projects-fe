"use client";

import { useMemo, useState } from "react";
import type { PostMeta } from "@/entities/post";
import { PostCard } from "./PostCard";
import { TagFilter } from "./TagFilter";

interface BlogListProps {
  posts: PostMeta[];
}

export function BlogList({ posts }: BlogListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
  };

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts],
  );

  const filtered = useMemo(
    () =>
      selectedTag ? posts.filter((p) => p.tags.includes(selectedTag)) : posts,
    [posts, selectedTag],
  );

  return (
    <div className="flex flex-col gap-8">
      <TagFilter
        tags={allTags}
        selected={selectedTag}
        onChange={handleTagChange}
      />

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-400">
          글이 없습니다.
        </p>
      ) : (
        <div>
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
