"use client";

import { type InputHTMLAttributes, forwardRef, useId } from "react";

import { cn } from "../lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label displayed above the input. Associates with the input via `htmlFor`/`id`. */
  label?: string;
  /** Helper text shown below the input when there is no error. */
  hint?: string;
  /**
   * Error message. When set, replaces `hint` and applies error border/ring styling.
   * Also sets `aria-invalid` on the input.
   */
  error?: string;
  /**
   * Node rendered inside the input on the left side.
   * Ideal for icons or currency symbols. Use `pointer-events-none` on pure decorative nodes.
   * @example
   * leading={<SearchIcon size={16} className="text-text-secondary" />}
   */
  leading?: React.ReactNode;
  /**
   * Node rendered inside the input on the right side.
   * Ideal for clear buttons, unit labels, or status icons.
   * @example
   * trailing={<button aria-label="지우기" onClick={clear}><CloseIcon size={16} /></button>}
   */
  trailing?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leading, trailing, id, disabled, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descId = `${inputId}-desc`;
    const hasError = Boolean(error);

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label htmlFor={inputId} className="type-label-1 text-text-primary">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leading && (
            <span className="pointer-events-none absolute left-3 flex items-center text-text-secondary">
              {leading}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={hint || error ? descId : undefined}
            className={cn(
              "h-10 w-full rounded-md border bg-surface px-3 outline-none",
              "type-body-2 text-text-primary placeholder:text-text-disabled",
              "transition-colors",
              "focus-visible:ring-2 focus-visible:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-40",
              leading && "pl-9",
              trailing && "pr-9",
              hasError
                ? "border-error focus-visible:ring-error"
                : "border-border focus-visible:ring-accent",
            )}
            {...props}
          />

          {trailing && (
            <span className="absolute right-3 flex items-center text-text-secondary">
              {trailing}
            </span>
          )}
        </div>

        {(hint || error) && (
          <p id={descId} className={cn("type-caption-1", hasError ? "text-error" : "text-text-secondary")}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
