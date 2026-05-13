"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "../lib/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Visual style of the button.
     * - `primary`     — filled accent, 주요 CTA
     * - `secondary`   — outlined, 보조 액션
     * - `ghost`       — transparent, 저강도 액션 또는 아이콘 버튼
     * - `destructive` — red filled, 삭제·취소 등 위험 액션
     * @default "primary"
     */
    variant?: "primary" | "secondary" | "ghost" | "destructive";
    /** @default "md" */
    size?: "sm" | "md" | "lg";
    /**
     * Shows a spinner and disables the button while true.
     * Use for async submit actions.
     * @default false
     */
    loading?: boolean;
}

/**
 * Button is the primary interactive control for triggering actions.
 *
 * @example
 * // Basic
 * <Button>저장</Button>
 * <Button variant="secondary" size="sm">취소</Button>
 *
 * // Async submit
 * <Button loading={isPending} onClick={handleSubmit}>제출</Button>
 *
 * // With trailing icon (ghost icon button)
 * <Button variant="ghost" size="sm">
 *   다음 <ArrowRightIcon size={16} />
 * </Button>
 *
 * // Destructive
 * <Button variant="destructive">삭제</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            loading = false,
            disabled,
            className,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    "inline-flex items-center justify-center font-medium rounded-md transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-40",
                    {
                        "bg-accent text-accent-foreground hover:bg-accent-hover":
                            variant === "primary",
                        "bg-surface-raised text-text-primary border border-border hover:bg-surface-overlay":
                            variant === "secondary",
                        "text-text-secondary hover:text-text-primary hover:bg-surface-raised":
                            variant === "ghost",
                        "bg-error text-error-foreground hover:opacity-90":
                            variant === "destructive",
                    },
                    {
                        "h-8  px-3 text-xs  gap-1.5": size === "sm",
                        "h-10 px-4 text-sm  gap-2": size === "md",
                        "h-12 px-6 text-base gap-2": size === "lg",
                    },
                    className,
                )}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin h-4 w-4 shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    },
);

Button.displayName = "Button";
