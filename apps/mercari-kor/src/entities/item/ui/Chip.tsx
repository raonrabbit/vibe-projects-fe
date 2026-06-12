interface ChipProps {
  label: string;
  primary?: boolean;
}

export function Chip({ label, primary }: ChipProps) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
        primary
          ? "border-accent/30 bg-accent/15 text-accent"
          : "border-border bg-surface-raised text-text-secondary"
      }`}
    >
      {label}
    </span>
  );
}
