import { cn } from "../lib/cn";

export interface SpinnerProps {
  /** Visual size of the spinner. @default "md" */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
};

/**
 * Spinner indicates an ongoing async operation.
 *
 * Wrap in a `role="status"` element when replacing page-level content so screen readers
 * announce the loading state.
 * @example
 * // Inline (inside a button or row)
 * <Spinner size="sm" />
 *
 * // Page-level
 * <div role="status" aria-label="로딩 중">
 *   <Spinner size="lg" />
 * </div>
 */
export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block rounded-full border-border-strong border-t-accent animate-spin",
        sizeClasses[size],
        className,
      )}
    />
  );
}
