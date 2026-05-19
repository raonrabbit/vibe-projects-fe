import { ICON_PROVIDERS, IconProvider } from "../config/icons";

interface IconProps {
  slug: string;
  alt: string;
  provider?: IconProvider;
  size?: number;
  className?: string;
}

export function Icon({
  slug,
  alt,
  provider = "simpleicons",
  size = 36,
  className,
}: IconProps) {
  const src = ICON_PROVIDERS[provider](slug);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
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
