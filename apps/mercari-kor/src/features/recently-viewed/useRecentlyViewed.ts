"use client";

import { useState } from "react";
import type { MercariItem } from "@/entities/item/model";
import {
    getRecentlyViewed,
    addRecentlyViewed,
} from "@/shared/lib/recently-viewed";

export function useRecentlyViewed() {
    const [recentlyViewed, setRecentlyViewed] =
        useState<MercariItem[]>(getRecentlyViewed);

    function trackItem(item: MercariItem) {
        addRecentlyViewed(item);
        setRecentlyViewed(getRecentlyViewed());
    }

    return { recentlyViewed, trackItem };
}
