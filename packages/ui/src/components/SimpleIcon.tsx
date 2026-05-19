"use client";

interface SimpleIconProps {
    slug: string;
    alt: string;
    size?: number;
    className?: string;
}

export function SimpleIcon({
    slug,
    alt,
    size = 36,
    className,
}: SimpleIconProps) {
    return (
        <img
            src={`https://cdn.simpleicons.org/${slug}`}
            alt={alt}
            width={size}
            height={size}
            className={className}
            onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
        />
    );
}

export type { SimpleIconProps };
