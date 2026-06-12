import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "./mdxComponents";

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light-default",
          },
          keepBackground: false,
        },
      ],
    ],
  },
};

export function MdxContent({ source }: { source: string }) {
  return (
    // @ts-expect-error – options type mismatch between unified versions
    <MDXRemote source={source} options={options} components={mdxComponents} />
  );
}
