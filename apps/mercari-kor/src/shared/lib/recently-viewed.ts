import type { MercariItem } from "./mercari";

const KEY = "merkori_recently_viewed";
const MAX = 10;

// Stable snapshot cache for useSyncExternalStore — must return same reference when data unchanged
let _cachedRaw: string | null = null;
let _cachedResult: MercariItem[] = [];

export function getRecentlyViewed(): MercariItem[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(KEY) ?? "[]";
        if (raw !== _cachedRaw) {
            _cachedRaw = raw;
            _cachedResult = JSON.parse(raw);
        }
        return _cachedResult;
    } catch {
        return [];
    }
}

export function addRecentlyViewed(item: MercariItem): void {
    const items = getRecentlyViewed().filter((i) => i.id !== item.id);
    items.unshift(item);
    const next = JSON.stringify(items.slice(0, MAX));
    localStorage.setItem(KEY, next);
    _cachedRaw = next;
    _cachedResult = JSON.parse(next);
}
