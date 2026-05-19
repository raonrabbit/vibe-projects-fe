"use client";

import type { MercariItem } from "@/entities/item/model";
import { ItemCard } from "@/entities/item/ui/ItemCard";

interface FavoritesTabProps {
    favorites: MercariItem[];
    onFavorite: (item: MercariItem) => void;
    onItemClick: (item: MercariItem) => void;
}

export function FavoritesTab({
    favorites,
    onFavorite,
    onItemClick,
}: FavoritesTabProps) {
    if (favorites.length === 0) {
        return (
            <div className="text-center py-24 text-text-secondary">
                <svg
                    className="mx-auto mb-3 opacity-30"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <p className="text-sm">좋아요한 상품이 없습니다</p>
                <p className="text-xs mt-1 opacity-70">
                    상품 카드의 하트 버튼을 눌러 저장해보세요
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {favorites.map((item) => (
                <ItemCard
                    key={item.id}
                    item={item}
                    isFavorited={true}
                    onFavorite={() => onFavorite(item)}
                    onVisit={() => onItemClick(item)}
                />
            ))}
        </div>
    );
}
