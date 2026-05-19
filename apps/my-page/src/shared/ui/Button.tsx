import { cn } from "../lib/cn";

type ButtonVariant = "solid" | "ghost" | "pill";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  solid: "bg-black text-white dark:bg-white dark:text-black",
  ghost: "bg-black/5 text-zinc-600 dark:bg-white/10 dark:text-zinc-400",
  pill: "rounded-full bg-black/5 text-zinc-600 dark:bg-white/10 dark:text-zinc-400",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
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
        "cursor-pointer rounded-full font-medium transition-colors",
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
