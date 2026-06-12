import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/cn";

import { Callout } from "./Callout";
import { Counter } from "./Counter";

type HeadingProps = ComponentPropsWithoutRef<"h2"> & { id?: string };

export const mdxComponents = {
  h1: ({ children, id, ...props }: HeadingProps) => (
    <h1
      id={id}
      className="mt-12 mb-4 scroll-mt-24 text-3xl font-bold text-black transition-[background-color] duration-300 dark:text-white"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }: HeadingProps) => (
    <h2
      id={id}
      className="mt-12 mb-4 scroll-mt-24 text-2xl font-bold text-black transition-[background-color] duration-300 dark:text-white"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }: HeadingProps) => (
    <h3
      id={id}
      className="mt-8 mb-3 scroll-mt-24 text-xl font-semibold text-black transition-[background-color] duration-300 dark:text-white"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-5 leading-8 text-zinc-700 dark:text-zinc-300" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a
      href={href}
      className="font-medium text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({
    children,
    ...props
  }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-6 border-l-4 border-zinc-300 pl-5 text-zinc-600 italic dark:border-zinc-600 dark:text-zinc-400"
      {...props}
    >
      {children}
    </blockquote>
  ),
  ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-5 ml-5 list-disc space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-5 ml-5 list-decimal space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-8 text-zinc-700 dark:text-zinc-300" {...props}>
      {children}
    </li>
  ),
  code: ({
    children,
    className,
    ...props
  }: ComponentPropsWithoutRef<"code">) => {
    if (!className) {
      return (
        <code
          className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, className, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-xl px-5 py-4 text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </pre>
  ),
  hr: () => <hr className="my-10 border-black/10 dark:border-white/10" />,
  img: ({ src, alt, ...props }: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      className="my-8 w-full rounded-xl"
      {...props}
    />
  ),
  table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th
      className="border border-black/10 bg-black/5 px-4 py-2 text-left font-semibold dark:border-white/10 dark:bg-white/5"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td
      className="border border-black/10 px-4 py-2 dark:border-white/10"
      {...props}
    >
      {children}
    </td>
  ),
  Callout,
  Counter,
};
