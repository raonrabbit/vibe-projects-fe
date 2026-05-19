"use client";

import { useState, useRef } from "react";

export default function ImageGallery({ photos }: { photos: string[] }) {
    const [current, setCurrent] = useState(0);
    const touchStartX = useRef<number | null>(null);

    if (photos.length === 0) return null;

    const prev = () =>
        setCurrent((c) => (c - 1 + photos.length) % photos.length);
    const next = () => setCurrent((c) => (c + 1) % photos.length);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) next();
            else prev();
        }
        touchStartX.current = null;
    };

    return (
        <div>
            {/* Main image */}
            <div
                className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-surface-raised"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={photos[current]}
                    alt=""
                    className="w-full h-full object-contain"
                />

                {/* Prev / Next buttons */}
                {photos.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full transition-opacity"
                            style={{
                                background: "rgba(0,0,0,0.45)",
                                color: "#fff",
                            }}
                            aria-label="이전 사진"
                        >
                            ‹
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full transition-opacity"
                            style={{
                                background: "rgba(0,0,0,0.45)",
                                color: "#fff",
                            }}
                            aria-label="다음 사진"
                        >
                            ›
                        </button>

                        {/* Dot indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {photos.map((_, i) => (
                                <span
                                    key={i}
                                    className="block rounded-full transition-all"
                                    style={{
                                        width: i === current ? 16 : 6,
                                        height: 6,
                                        background:
                                            i === current
                                                ? "#fff"
                                                : "rgba(255,255,255,0.5)",
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {photos.map((photo, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all border-2 ${
                                i === current
                                    ? "border-accent opacity-100"
                                    : "border-border opacity-60"
                            }`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={photo}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
