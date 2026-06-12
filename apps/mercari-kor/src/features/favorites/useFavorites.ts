"use client";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import { startTransition, useEffect, useState } from "react";

import type { MercariItem } from "@/entities/item/model";

export function useFavorites(user: User | null, supabase: SupabaseClient) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<MercariItem[]>([]);

  useEffect(() => {
    if (!user) {
      startTransition(() => {
        setFavorites([]);
        setFavoriteIds(new Set());
      });
      return;
    }

    supabase
      .from("favorites")
      .select("item_id, item_name, item_price, item_thumbnail")
      .then(({ data }) => {
        if (!data) return;
        const favItems: MercariItem[] = data.map((d) => ({
          id: d.item_id,
          name: d.item_name,
          price: d.item_price,
          thumbnails: d.item_thumbnail ? [d.item_thumbnail] : [],
          itemConditionId: 0,
          sellerId: "",
          status: "STATUS_ON_SALE",
        }));
        setFavorites(favItems);
        setFavoriteIds(new Set(data.map((d) => d.item_id)));
      });
  }, [user, supabase]);

  async function toggleFavorite(item: MercariItem) {
    if (!user) return;
    if (favoriteIds.has(item.id)) {
      const { error: delError } = await supabase
        .from("favorites")
        .delete()
        .eq("item_id", item.id);
      if (!delError) {
        setFavoriteIds((prev) => {
          const s = new Set(prev);
          s.delete(item.id);
          return s;
        });
        setFavorites((prev) => prev.filter((i) => i.id !== item.id));
      }
    } else {
      const { error: insError } = await supabase.from("favorites").insert({
        user_id: user.id,
        item_id: item.id,
        item_name: item.name,
        item_price: item.price,
        item_thumbnail: item.thumbnails?.[0] ?? "",
      });
      if (!insError) {
        setFavoriteIds((prev) => new Set([...prev, item.id]));
        setFavorites((prev) => [item, ...prev]);
      }
    }
  }

  return { favorites, favoriteIds, toggleFavorite };
}
