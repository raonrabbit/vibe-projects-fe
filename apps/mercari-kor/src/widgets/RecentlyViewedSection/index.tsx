"use client";

import type { MercariItem } from "@/entities/item/model";
import { ItemCard } from "@/entities/item/ui/ItemCard";

interface RecentlyViewedSectionProps {
    items: MercariItem[];
    favoriteIds: Set<string>;
    onFavorite?: (item: MercariItem) => void;
    onItemClick: (item: MercariItem) => void;
}

export function RecentlyViewedSection({
    items,
    favoriteIds,
    onFavorite,
    onItemClick,
}: RecentlyViewedSectionProps) {
    if (items.length === 0) return null;

    return (
        <div className="mb-6">
            <p className="text-xs font-semibold mb-3 text-text-secondary">
                최근 본 상품
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {items.map((item) => (
                    <ItemCard
                        key={item.id}
                        item={item}
                        isFavorited={favoriteIds.has(item.id)}
                        onFavorite={
                            onFavorite ? () => onFavorite(item) : undefined
                        }
                        onVisit={() => onItemClick(item)}
                    />
                ))}
            </div>
        </div>
    );
}
