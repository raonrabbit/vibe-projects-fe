import { cn } from "../lib/cn";

export interface DividerProps {
  /** Layout axis. @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /**
   * Optional label centered inside a horizontal divider.
   * Common values: "또는", "AND", "OR".
   */
  label?: string;
  className?: string;
}

/**
 * Divider separates content sections with a subtle line.
 *
 * For a vertical divider, place it inside a flex row with `items-stretch` or a fixed height,
 * and it will fill the container height via `self-stretch`.
 * @example
 * // Plain horizontal
 * <Divider />
 *
 * // Labeled separator
 * <Divider label="또는" />
 *
 * // Vertical (requires a flex-row parent with defined height)
 * <div className="flex h-8 items-center gap-3">
 *   <span>Left</span>
 *   <Divider orientation="vertical" />
 *   <span>Right</span>
 * </div>
 */
export function Divider({ orientation = "horizontal", label, className }: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("self-stretch w-px bg-border", className)}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn("flex items-center gap-3", className)}
      >
        <div className="h-px flex-1 bg-border" />
        <span className="type-caption-1 select-none text-text-secondary">{label}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn("h-px w-full bg-border", className)}
    />
  );
}
