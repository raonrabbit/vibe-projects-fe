interface InfoRowProps {
    label: string;
    value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
    return (
        <div className="flex items-center justify-between text-sm gap-4">
            <span className="text-text-secondary">{label}</span>
            <span className="text-right text-text-primary">{value}</span>
        </div>
    );
}
