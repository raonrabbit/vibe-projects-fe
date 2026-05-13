"use client";

import { useState, type HTMLAttributes } from "react";

import { cn } from "../lib/cn";

export interface SegmentedControlOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SegmentedControlOption[];
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value when uncontrolled. Defaults to first option. */
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function SegmentedControl({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  className,
  ...props
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? options[0]?.value ?? "",
  );
  const isControlled = controlledValue !== undefined;
  const current = isControlled ? controlledValue : internalValue;

  function handleSelect(val: string) {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  }

  return (
    <div
      role="radiogroup"
      className={cn("inline-flex rounded-lg bg-surface-raised p-1 gap-1", className)}
      {...props}
    >
      {options.map((opt) => {
        const selected = current === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={opt.disabled}
            onClick={() => !opt.disabled && handleSelect(opt.value)}
            className={cn(
              "type-label-1 rounded-md px-4 py-1.5 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
              "disabled:pointer-events-none disabled:opacity-40",
              selected
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
