"use client";

import { useState } from "react";
import { ProjectThumbnail } from "@/shared";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div>
      {/* Main image — height 기준으로 채우고 옆 overflow 허용 */}
      <div className="relative h-64 overflow-hidden rounded-2xl sm:h-96">
        <img
          key={selectedIndex}
          src={images[selectedIndex]}
          alt={`${alt} ${selectedIndex + 1}`}
          className="absolute left-1/2 h-full w-auto -translate-x-1/2 transition-opacity duration-300"
        />
      </div>

      {/* Thumbnail strip — only when more than one image */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`group shrink-0 cursor-pointer rounded-lg border-2 focus:outline-none ${
                i === selectedIndex
                  ? "border-black dark:border-white"
                  : "border-transparent"
              }`}
              aria-label={`이미지 ${i + 1} 선택`}
            >
              <ProjectThumbnail
                src={src}
                alt={`${alt} 썸네일 ${i + 1}`}
                className="h-16 w-24 rounded-[6px]"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
