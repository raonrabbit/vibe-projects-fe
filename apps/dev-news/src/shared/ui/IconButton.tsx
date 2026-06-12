"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/shared/lib/cn";

import { Spinner } from "./Spinner";

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label"
> {
  variant?: "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  "aria-label": string;
}

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
          "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-40",
          {
            "text-text-secondary hover:bg-surface-raised hover:text-text-primary":
              variant === "ghost",
            "border border-border bg-surface-raised text-text-primary hover:bg-surface-overlay":
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
