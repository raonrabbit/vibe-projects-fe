"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/shared/lib/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

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
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-40",
          {
            "bg-accent text-accent-foreground hover:bg-accent-hover":
              variant === "primary",
            "border border-border bg-surface-raised text-text-primary hover:bg-surface-overlay":
              variant === "secondary",
            "text-text-secondary hover:bg-surface-raised hover:text-text-primary":
              variant === "ghost",
            "bg-error text-error-foreground hover:opacity-90":
              variant === "destructive",
          },
          {
            "h-8 gap-1.5 px-3 text-xs": size === "sm",
            "h-10 gap-2 px-4 text-sm": size === "md",
            "h-12 gap-2 px-6 text-base": size === "lg",
          },
          className,
        )}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 shrink-0 animate-spin"
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
