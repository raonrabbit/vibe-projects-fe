import { type HTMLAttributes } from "react";

import { cn } from "../lib/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "primary" | "success" | "warning" | "error";
    size?: "sm" | "md";
}

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
