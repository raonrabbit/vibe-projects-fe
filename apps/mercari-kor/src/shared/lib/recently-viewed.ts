import type { MercariItem } from "./mercari";

const KEY = "merkori_recently_viewed";
const MAX = 10;

export function getRecentlyViewed(): MercariItem[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {
        return [];
    }
}

export function addRecentlyViewed(item: MercariItem): void {
    const items = getRecentlyViewed().filter((i) => i.id !== item.id);
    items.unshift(item);
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
}
