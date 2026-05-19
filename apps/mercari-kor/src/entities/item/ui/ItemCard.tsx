"use client";

import type { MercariItem } from "../model";

interface ItemCardProps {
    item: MercariItem;
    isFavorited?: boolean;
    onFavorite?: () => void;
    onVisit?: () => void;
}

export function ItemCard({
    item,
    isFavorited,
    onFavorite,
    onVisit,
}: ItemCardProps) {
    const thumbnail = item.thumbnails?.[0] ?? "";

    return (
        <a
            href={`/item/${item.id}`}
            onClick={onVisit}
            className="relative rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg block bg-surface border border-border"
        >
            <div className="aspect-square overflow-hidden relative bg-surface-raised">
                {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={thumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-text-secondary">
                        이미지 없음
                    </div>
                )}
                {item.status === "ITEM_STATUS_SOLD_OUT" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="text-white text-lg font-bold tracking-widest">
                            SOLD
                        </span>
                    </div>
                )}
            </div>
            <div className="p-2">
                <p className="text-xs line-clamp-2 mb-1 text-text-primary">
                    {item.name}
                </p>
                <p className="text-sm font-bold text-accent">
                    ¥{item.price.toLocaleString()}
                </p>
            </div>

            {onFavorite && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onFavorite();
                    }}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all backdrop-blur-sm ${
                        isFavorited ? "bg-accent" : "bg-black/45"
                    }`}
                    title={isFavorited ? "좋아요 취소" : "좋아요"}
                >
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill={isFavorited ? "white" : "none"}
                        stroke="white"
                        strokeWidth={2.5}
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>
            )}
        </a>
    );
}
