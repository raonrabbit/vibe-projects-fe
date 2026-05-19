interface ChipProps {
    label: string;
    primary?: boolean;
}

export function Chip({ label, primary }: ChipProps) {
    return (
        <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                primary
                    ? "bg-accent/15 text-accent border-accent/30"
                    : "bg-surface-raised text-text-secondary border-border"
            }`}
        >
            {label}
        </span>
    );
}
