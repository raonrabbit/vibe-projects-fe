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
      src={`/icons/skills/${slug}.svg`}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={className}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
