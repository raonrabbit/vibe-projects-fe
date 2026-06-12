export function LeftTooltip({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded bg-black/60 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
      {label}
    </div>
  );
}
