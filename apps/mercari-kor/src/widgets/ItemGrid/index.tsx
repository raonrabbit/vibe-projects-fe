"use client";

import type { MercariItem } from "@/entities/item/model";
import { ItemCard } from "@/entities/item/ui/ItemCard";

interface ItemGridProps {
  items: MercariItem[];
  loading: boolean;
  hasSearched: boolean;
  favoriteIds: Set<string>;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  onFavorite?: (item: MercariItem) => void;
  onItemClick: (item: MercariItem) => void;
}

export function ItemGrid({
  items,
  loading,
  hasSearched,
  favoriteIds,
  sentinelRef,
  onFavorite,
  onItemClick,
}: ItemGridProps) {
  const isEmpty = hasSearched && !loading && items.length === 0;

  return (
    <>
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isFavorited={favoriteIds.has(item.id)}
              onFavorite={onFavorite ? () => onFavorite(item) : undefined}
              onVisit={() => onItemClick(item)}
            />
          ))}
        </div>
      )}

      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-24 text-text-secondary">
          <span className="text-base">검색 결과가 없습니다</span>
        </div>
      )}

      <div
        ref={sentinelRef}
        className="mt-4 flex h-10 items-center justify-center"
      >
        {loading && items.length > 0 && (
          <span className="text-sm text-text-secondary">불러오는 중...</span>
        )}
      </div>
    </>
  );
}
