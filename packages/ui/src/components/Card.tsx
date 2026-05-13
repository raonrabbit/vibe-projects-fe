import { type HTMLAttributes } from "react";

import { cn } from "../lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** Adds hover shadow and pointer cursor for clickable cards. @default false */
    hover?: boolean;
    /**
     * Internal padding preset.
     * - `none` — no padding (content bleeds to edge, e.g. full-bleed images)
     * - `sm`   — 12px
     * - `md`   — 16px / 20px (responsive)
     * - `lg`   — 24px / 32px (responsive)
     * @default "md"
     */
    padding?: "none" | "sm" | "md" | "lg";
}

/**
 * Card is a surface container for grouping related content.
 * Compose freely with any children — titles, body text, badges, buttons, etc.
 *
 * @example
 * // Static card
 * <Card>
 *   <h2 className="type-heading-2 text-text-primary">제목</h2>
 *   <p className="type-body-2 text-text-secondary">본문 내용</p>
 * </Card>
 *
 * // Clickable card
 * <Card hover onClick={handleClick}>...</Card>
 *
 * // Full-bleed image card
 * <Card padding="none">
 *   <img src={thumbnail} className="w-full" />
 *   <div className="p-4">...</div>
 * </Card>
 */
export function Card({
    hover = false,
    padding = "md",
    className,
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "bg-surface border border-border rounded-xl overflow-hidden",
                hover && "transition-shadow hover:shadow-md cursor-pointer",
                {
                    "": padding === "none",
                    "p-3": padding === "sm",
                    "p-4 md:p-5": padding === "md",
                    "p-6 md:p-8": padding === "lg",
                },
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
