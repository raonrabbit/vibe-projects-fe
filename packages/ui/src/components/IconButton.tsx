"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "../lib/cn";
import { Spinner } from "./Spinner";

export interface IconButtonProps extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "aria-label"
> {
    /**
     * Visual style of the button.
     * - `ghost`     — transparent, 아이콘 버튼 기본값
     * - `secondary` — outlined, 더 강한 강조가 필요할 때
     * @default "ghost"
     */
    variant?: "ghost" | "secondary";
    /** @default "md" */
    size?: "sm" | "md" | "lg";
    /**
     * Shows a spinner and disables the button while true.
     * @default false
     */
    loading?: boolean;
    /** 스크린 리더용 레이블. 아이콘만 있는 버튼이므로 필수. */
    "aria-label": string;
}

/**
 * Icon-only button. children에는 아이콘 하나만 전달한다.
 *
 * @example
 * <IconButton aria-label="테마 전환" onClick={toggle}>
 *   <MoonIcon size={16} />
 * </IconButton>
 *
 * <IconButton variant="secondary" size="sm" aria-label="닫기">
 *   <CloseIcon size={14} />
 * </IconButton>
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        {
            variant = "ghost",
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
                    "inline-flex items-center justify-center rounded-md transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-40",
                    {
                        "text-text-secondary hover:text-text-primary hover:bg-surface-raised":
                            variant === "ghost",
                        "bg-surface-raised text-text-primary border border-border hover:bg-surface-overlay":
                            variant === "secondary",
                    },
                    {
                        "h-8 w-8": size === "sm",
                        "h-9 w-9": size === "md",
                        "h-10 w-10": size === "lg",
                    },
                    className,
                )}
                {...props}
            >
                {loading ? <Spinner size="sm" /> : children}
            </button>
        );
    },
);

IconButton.displayName = "IconButton";
