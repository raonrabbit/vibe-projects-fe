import Image from "next/image";

import { cn } from "../lib/cn";

interface ProjectThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

export function ProjectThumbnail({
  src,
  alt,
  className,
  sizes = "100vw",
}: ProjectThumbnailProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain transition-transform duration-300 group-hover:scale-105"
        sizes={sizes}
      />
    </div>
  );
}
