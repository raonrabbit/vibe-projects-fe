"use client";

import { useSyncExternalStore } from "react";

import type { MercariItem } from "@/entities/item/model";
import {
  addRecentlyViewed,
  getRecentlyViewed,
} from "@/shared/lib/recently-viewed";

let _listeners: (() => void)[] = [];

function subscribe(cb: () => void) {
  _listeners.push(cb);
  return () => {
    _listeners = _listeners.filter((l) => l !== cb);
  };
}

function notify() {
  _listeners.forEach((cb) => cb());
}

export function useRecentlyViewed() {
  const recentlyViewed = useSyncExternalStore(
    subscribe,
    getRecentlyViewed,
    () => [] as MercariItem[],
  );

  function trackItem(item: MercariItem) {
    addRecentlyViewed(item);
    notify();
  }

  return { recentlyViewed, trackItem };
}
