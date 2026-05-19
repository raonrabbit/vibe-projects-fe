import { cn } from "../lib/cn";

type LabelSize = "xs" | "sm" | "md";

interface LabelProps {
  children: React.ReactNode;
  size?: LabelSize;
  className?: string;
}

const sizeStyles: Record<LabelSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
};

export function Label({ children, size = "xs", className }: LabelProps) {
  return (
    <span
      className={cn(
        "text-center font-medium text-zinc-500 dark:text-zinc-400",
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
