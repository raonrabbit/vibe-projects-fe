import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type CalloutType = "info" | "tip" | "warning" | "important";

const variants: Record<
  CalloutType,
  { container: string; label: string; labelStyle: string }
> = {
  info: {
    container:
      "border-blue-200 bg-blue-50 dark:border-blue-800/60 dark:bg-blue-950/30",
    label: "INFO",
    labelStyle: "text-blue-600 dark:text-blue-400",
  },
  tip: {
    container:
      "border-emerald-200 bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/30",
    label: "TIP",
    labelStyle: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    container:
      "border-amber-200 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/30",
    label: "WARNING",
    labelStyle: "text-amber-600 dark:text-amber-400",
  },
  important: {
    container:
      "border-rose-200 bg-rose-50 dark:border-rose-800/60 dark:bg-rose-950/30",
    label: "IMPORTANT",
    labelStyle: "text-rose-600 dark:text-rose-400",
  },
};

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const { container, label, labelStyle } = variants[type];
  return (
    <div className={cn("my-6 rounded-xl border px-5 py-4", container)}>
      <div
        className={cn(
          "mb-1.5 flex items-baseline gap-2 text-xs font-bold tracking-widest",
          labelStyle,
        )}
      >
        {label}
        {title && (
          <span className="text-sm font-semibold tracking-normal text-zinc-700 normal-case dark:text-zinc-300">
            {title}
          </span>
        )}
      </div>
      <div className="text-sm leading-7 text-zinc-700 dark:text-zinc-300 [&>li]:leading-6 [&>p]:mb-2 [&>p]:leading-7 [&>p:last-child]:mb-0 [&>ul]:mb-1 [&>ul]:ml-4">
        {children}
      </div>
    </div>
  );
}
