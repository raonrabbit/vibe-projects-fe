import { type HTMLAttributes } from "react";

import { cn } from "../lib/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /**
     * Visual style of the badge.
     * - `default` — neutral, for secondary labels (카테고리, 태그)
     * - `primary` — accent color, for brand-aligned highlights
     * - `success` — green, for positive statuses (완료, 활성)
     * - `warning` — yellow, for cautionary statuses (검토 중, 주의)
     * - `error`   — red, for negative statuses (실패, 만료)
     * @default "default"
     */
    variant?: "default" | "primary" | "success" | "warning" | "error";
    /** @default "md" */
    size?: "sm" | "md";
}

/**
 * Badge renders a small inline label for statuses, categories, or counts.
 *
 * @example
 * <Badge variant="success">완료</Badge>
 * <Badge variant="warning" size="sm">검토 중</Badge>
 */
export function Badge({
    variant = "default",
    size = "md",
    className,
    children,
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center font-medium rounded-sm",
                {
                    "bg-surface-overlay text-text-secondary":
                        variant === "default",
                    "bg-accent-subtle text-accent": variant === "primary",
                    "bg-success-subtle text-success": variant === "success",
                    "bg-warning-subtle text-warning": variant === "warning",
                    "bg-error-subtle text-error": variant === "error",
                },
                {
                    "px-2 py-0.5 text-xs": size === "sm",
                    "px-2.5 py-1 text-sm": size === "md",
                },
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}
