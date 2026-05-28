export function LeftTooltip({ label }: { label: string }) {
    return (
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {label}
        </div>
    );
}
