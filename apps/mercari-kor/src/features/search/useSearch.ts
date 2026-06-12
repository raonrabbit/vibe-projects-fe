"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { BrandSuggestion, MercariItem } from "@/entities/item/model";

export function useSearch() {
  const [items, setItems] = useState<MercariItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Refs for stable closures (used by IntersectionObserver)
  const nextPageTokenRef = useRef("");
  const loadingRef = useRef(false);
  const selectedKeywordsRef = useRef<string[]>([]);
  const selectedBrandsRef = useRef<BrandSuggestion[]>([]);
  const onSaleOnlyRef = useRef(false);
  const priceMinRef = useRef(0);
  const priceMaxRef = useRef(0);
  const sizeIdRef = useRef<number[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const restoreScrollRef = useRef<number | null>(null);

  const fetchItems = useCallback(async (reset: boolean) => {
    if (loadingRef.current) return;
    if (!reset && !nextPageTokenRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError("");

    const pageToken = reset ? "" : nextPageTokenRef.current;
    const brands = selectedBrandsRef.current;
    const effectiveKeyword = selectedKeywordsRef.current.join(" ");

    try {
      let url = `/api/mercari/search?keyword=${encodeURIComponent(effectiveKeyword)}&pageToken=${pageToken}`;
      if (brands.length > 0)
        url += `&brandId=${brands.map((b) => b.id).join(",")}`;
      if (onSaleOnlyRef.current) url += `&onSaleOnly=true`;
      if (priceMinRef.current > 0) url += `&priceMin=${priceMinRef.current}`;
      if (priceMaxRef.current > 0) url += `&priceMax=${priceMaxRef.current}`;
      if (sizeIdRef.current.length > 0)
        url += `&sizeId=${sizeIdRef.current.join(",")}`;

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const token = data.nextPageToken ?? "";
      nextPageTokenRef.current = token;
      setHasMore(!!token);
      setItems((prev) => {
        if (reset) return data.items;
        const existingIds = new Set(prev.map((i: MercariItem) => i.id));
        return [
          ...prev,
          ...(data.items as MercariItem[]).filter(
            (i) => !existingIds.has(i.id),
          ),
        ];
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  const setupObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          nextPageTokenRef.current &&
          !loadingRef.current
        ) {
          fetchItems(false);
        }
      },
      { rootMargin: "200px" },
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
  }, [fetchItems]);

  useEffect(() => {
    setupObserver();
    return () => observerRef.current?.disconnect();
  }, [setupObserver]);

  useEffect(() => {
    if (hasMore && sentinelRef.current) {
      observerRef.current?.observe(sentinelRef.current);
    }
  }, [hasMore, items]);

  // Restore scroll after cached items render
  useEffect(() => {
    if (restoreScrollRef.current !== null && items.length > 0) {
      const y = restoreScrollRef.current;
      restoreScrollRef.current = null;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => window.scrollTo(0, y)),
      );
    }
  }, [items]);

  /** Call when starting a new search (from URL sync) */
  function startSearch(
    keywords: string[],
    brands: BrandSuggestion[],
    onSaleOnly: boolean,
    cachedItems?: MercariItem[],
    cachedToken?: string,
    cachedScrollY?: number,
    priceMin = 0,
    priceMax = 0,
    sizeId: number[] = [],
  ) {
    selectedKeywordsRef.current = keywords;
    selectedBrandsRef.current = brands;
    onSaleOnlyRef.current = onSaleOnly;
    priceMinRef.current = priceMin;
    priceMaxRef.current = priceMax;
    sizeIdRef.current = sizeId;

    if (cachedItems && cachedItems.length > 0) {
      nextPageTokenRef.current = cachedToken ?? "";
      setHasMore(!!cachedToken);
      setItems(cachedItems);
      setHasSearched(true);
      restoreScrollRef.current = cachedScrollY ?? 0;
      return;
    }

    nextPageTokenRef.current = "";
    setItems([]);
    setHasMore(false);
    setHasSearched(true);
    fetchItems(true);
  }

  function resetSearch() {
    nextPageTokenRef.current = "";
    selectedKeywordsRef.current = [];
    selectedBrandsRef.current = [];
    onSaleOnlyRef.current = false;
    priceMinRef.current = 0;
    priceMaxRef.current = 0;
    sizeIdRef.current = [];
    setItems([]);
    setHasSearched(false);
    setHasMore(false);
    setError("");
  }

  return {
    items,
    loading,
    error,
    hasMore,
    hasSearched,
    sentinelRef,
    restoreScrollRef,
    nextPageTokenRef,
    startSearch,
    resetSearch,
  };
}
