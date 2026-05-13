"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";

import { cn } from "../lib/cn";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Label displayed next to the checkbox. Associates with the input via `htmlFor`/`id`. */
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, disabled, className, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <span className="relative flex h-4 w-4 shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            {...props}
          />
          {/* Visual box */}
          <span
            className={cn(
              "pointer-events-none h-4 w-4 rounded border border-border bg-surface transition-colors",
              "peer-checked:border-accent peer-checked:bg-accent",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2",
              disabled && "opacity-40",
            )}
          />
          {/* Checkmark — sibling of input so peer-checked works */}
          <svg
            className="pointer-events-none absolute inset-0 m-auto h-2.5 w-2.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="1.5,5 4,7.5 8.5,2.5" />
          </svg>
        </span>
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              "type-body-2 cursor-pointer select-none text-text-primary",
              disabled && "cursor-not-allowed opacity-40",
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
