export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  draft?: boolean;
}

export interface Post extends PostMeta {
  content: string;
}
