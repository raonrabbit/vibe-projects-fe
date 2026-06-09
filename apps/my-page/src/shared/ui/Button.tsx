import { cn } from "../lib/cn";

type ButtonVariant = "solid" | "ghost" | "pill";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  solid:
    "bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200",
  ghost:
    "bg-black/5 text-zinc-600 dark:bg-white/10 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/15",
  pill: "rounded-full bg-black/5 text-zinc-600 dark:bg-white/10 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/15",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-12 px-3 py-2 text-xs",
  md: "min-h-12 px-4 py-2 text-sm",
  lg: "min-h-12 px-6 py-3 text-base",
};

export function Button({
  variant = "ghost",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-full font-medium transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
