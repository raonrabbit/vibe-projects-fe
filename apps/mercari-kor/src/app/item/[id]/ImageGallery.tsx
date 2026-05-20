"use client";

import { useState, useRef } from "react";

const THUMB_W = 56;
const THUMB_GAP = 8;
const THUMB_VISIBLE = 5;

export default function ImageGallery({ photos }: { photos: string[] }) {
    const [current, setCurrent] = useState(0);
    const [thumbStart, setThumbStart] = useState(0);
    const touchStartX = useRef<number | null>(null);

    if (photos.length === 0) return null;

    function navigate(newIdx: number) {
        setCurrent(newIdx);
        setThumbStart((prev) => {
            if (newIdx < prev) return newIdx;
            if (newIdx >= prev + THUMB_VISIBLE)
                return Math.min(
                    newIdx - THUMB_VISIBLE + 1,
                    Math.max(0, photos.length - THUMB_VISIBLE),
                );
            return prev;
        });
    }

    const prev = () => navigate((current - 1 + photos.length) % photos.length);
    const next = () => navigate((current + 1) % photos.length);

    const canScrollThumbs = photos.length > THUMB_VISIBLE;
    const thumbContainerW =
        THUMB_VISIBLE * THUMB_W + (THUMB_VISIBLE - 1) * THUMB_GAP;

    const thumbPrev = () => setThumbStart((s) => Math.max(0, s - 1));
    const thumbNext = () =>
        setThumbStart((s) =>
            Math.min(s + 1, Math.max(0, photos.length - THUMB_VISIBLE)),
        );

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
            {/* Main image — sliding carousel */}
            <div
                className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-surface-raised"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <div
                    className="flex h-full transition-transform duration-300 ease-in-out"
                    style={{
                        width: `${photos.length * 100}%`,
                        transform: `translateX(-${(current * 100) / photos.length}%)`,
                    }}
                >
                    {photos.map((photo, i) => (
                        <div
                            key={i}
                            className="h-full"
                            style={{ width: `${100 / photos.length}%` }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={photo}
                                alt=""
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ))}
                </div>

                {photos.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full transition-opacity bg-black/45 text-white"
                            aria-label="이전 사진"
                        >
                            ‹
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full transition-opacity bg-black/45 text-white"
                            aria-label="다음 사진"
                        >
                            ›
                        </button>

                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {photos.map((_, i) => (
                                <span
                                    key={i}
                                    className={`block rounded-full transition-all duration-300 ${
                                        i === current
                                            ? "bg-white"
                                            : "bg-white/50"
                                    }`}
                                    style={{
                                        width: i === current ? 16 : 6,
                                        height: 6,
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {photos.length > 1 && (
                <div className="flex items-center gap-2">
                    {canScrollThumbs && (
                        <button
                            onClick={thumbPrev}
                            disabled={thumbStart === 0}
                            className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-opacity disabled:opacity-30 bg-black/35 text-white"
                            aria-label="썸네일 이전"
                        >
                            ‹
                        </button>
                    )}

                    <div
                        className="overflow-hidden"
                        style={{
                            width: canScrollThumbs ? thumbContainerW : "auto",
                        }}
                    >
                        <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{
                                gap: `${THUMB_GAP}px`,
                                transform: `translateX(-${thumbStart * (THUMB_W + THUMB_GAP)}px)`,
                            }}
                        >
                            {photos.map((photo, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(i)}
                                    className={`flex-shrink-0 rounded-lg overflow-hidden transition-all border-2 ${
                                        i === current
                                            ? "border-accent opacity-100"
                                            : "border-border opacity-60"
                                    }`}
                                    style={{ width: THUMB_W, height: THUMB_W }}
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
                    </div>

                    {canScrollThumbs && (
                        <button
                            onClick={thumbNext}
                            disabled={
                                thumbStart >= photos.length - THUMB_VISIBLE
                            }
                            className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-opacity disabled:opacity-30 bg-black/35 text-white"
                            aria-label="썸네일 다음"
                        >
                            ›
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
