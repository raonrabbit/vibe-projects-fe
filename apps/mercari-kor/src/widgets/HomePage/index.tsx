"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import type {
  BrandSuggestion,
  MercariItem,
  SizeOption,
} from "@/entities/item/model";
import { useAuth } from "@/features/auth/useAuth";
import { useBrandFilter } from "@/features/brand-filter/useBrandFilter";
import { useFavorites } from "@/features/favorites/useFavorites";
import { useRecentlyViewed } from "@/features/recently-viewed/useRecentlyViewed";
import { useSearch } from "@/features/search/useSearch";
import { useTheme } from "@/features/theme/useTheme";
import { AppHeader } from "@/widgets/AppHeader";
import { BrandModal } from "@/widgets/BrandModal";
import { FavoritesTab } from "@/widgets/FavoritesTab";
import type { FilterValues } from "@/widgets/FilterPanel";
import { FilterPanel } from "@/widgets/FilterPanel";
import { ItemGrid } from "@/widgets/ItemGrid";
import { RecentlyViewedSection } from "@/widgets/RecentlyViewedSection";
import { SearchBar } from "@/widgets/SearchBar";

type Tab = "search" | "favorites";

export function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isDark, toggle } = useTheme();
  const { user, supabase, signIn, signOut, inAppBrowser } = useAuth();
  const { favorites, favoriteIds, toggleFavorite } = useFavorites(
    user,
    supabase,
  );
  const search = useSearch();
  const brandFilter = useBrandFilter();
  const { recentlyViewed, trackItem } = useRecentlyViewed();

  const [keyword, setKeyword] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const tab: Tab =
    searchParams.get("tab") === "favorites" ? "favorites" : "search";
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Applied filter state (mirrors URL params)
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({
    onSaleOnly: false,
    priceMin: "",
    priceMax: "",
    sizes: [],
    brands: [],
  });

  // Sync URL params → state + trigger search
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const bIdsStr = searchParams.get("brandId") ?? "";
    const bNamesStr = searchParams.get("brandName") ?? "";
    const onSaleOnly = searchParams.get("onSaleOnly") === "true";
    const priceMin = searchParams.get("priceMin") ?? "";
    const priceMax = searchParams.get("priceMax") ?? "";
    const sizeIdStr = searchParams.get("sizeId") ?? "";
    const sizeNamesStr = searchParams.get("sizeName") ?? "";
    const sizeGroupsStr = searchParams.get("sizeGroup") ?? "";

    const bIds = bIdsStr ? bIdsStr.split(",").map(Number).filter(Boolean) : [];
    const bNames = bNamesStr ? bNamesStr.split(",") : [];
    const brands: BrandSuggestion[] = bIds.map((id, i) => ({
      id,
      name: bNames[i] ?? "",
    }));

    const sizeIds = sizeIdStr
      ? sizeIdStr.split(",").map(Number).filter(Boolean)
      : [];
    const sizeNames = sizeNamesStr ? sizeNamesStr.split(",") : [];
    const sizeGroups = sizeGroupsStr ? sizeGroupsStr.split(",") : [];
    const sizes: SizeOption[] = sizeIds.map((id, i) => ({
      id,
      name: sizeNames[i] ?? "",
      group: sizeGroups[i] ?? "",
    }));

    if (!q && brands.length === 0) {
      search.resetSearch();
      startTransition(() => {
        setSelectedKeywords([]);
        brandFilter.setSelectedBrands([]);
        setAppliedFilters({
          onSaleOnly: false,
          priceMin: "",
          priceMax: "",
          sizes: [],
          brands: [],
        });
      });
      return;
    }

    const keywords = q ? q.split(" ").filter(Boolean) : [];
    startTransition(() => {
      setKeyword("");
      setSelectedKeywords(keywords);
      brandFilter.setSelectedBrands(brands);
      setAppliedFilters({
        onSaleOnly,
        priceMin,
        priceMax,
        sizes,
        brands,
      });
    });

    // Check sessionStorage cache for back-navigation
    const searchKey = "?" + searchParams.toString();
    const cachedRaw = sessionStorage.getItem("merkori_search_state");
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw);
        if (
          cached.key === searchKey &&
          Array.isArray(cached.items) &&
          cached.items.length > 0
        ) {
          sessionStorage.removeItem("merkori_search_state");
          search.startSearch(
            keywords,
            brands,
            onSaleOnly,
            cached.items,
            cached.nextPageToken,
            cached.scrollY,
            parseInt(priceMin, 10) || 0,
            parseInt(priceMax, 10) || 0,
            sizeIds,
          );
          return;
        }
      } catch {
        // ignore malformed cache
      }
    }

    search.startSearch(
      keywords,
      brands,
      onSaleOnly,
      undefined,
      undefined,
      undefined,
      parseInt(priceMin, 10) || 0,
      parseInt(priceMax, 10) || 0,
      sizeIds,
    );
  }, [searchParams]);

  function handleTabChange(newTab: Tab) {
    const params = new URLSearchParams(searchParams.toString());
    if (newTab === "favorites") {
      params.set("tab", "favorites");
    } else {
      params.delete("tab");
    }
    router.replace(params.toString() ? `/?${params.toString()}` : "/");
  }

  function buildParams(
    keywords: string[],
    filters: FilterValues,
  ): URLSearchParams {
    const params = new URLSearchParams();
    if (keywords.length > 0) params.set("q", keywords.join(" "));
    if (filters.brands.length > 0) {
      params.set("brandId", filters.brands.map((b) => b.id).join(","));
      params.set("brandName", filters.brands.map((b) => b.name).join(","));
    }
    if (filters.onSaleOnly) params.set("onSaleOnly", "true");
    if (filters.priceMin) params.set("priceMin", filters.priceMin);
    if (filters.priceMax) params.set("priceMax", filters.priceMax);
    if (filters.sizes.length > 0) {
      params.set("sizeId", filters.sizes.map((s) => s.id).join(","));
      params.set("sizeName", filters.sizes.map((s) => s.name).join(","));
      params.set("sizeGroup", filters.sizes.map((s) => s.group).join(","));
    }
    return params;
  }

  function handleSearch() {
    const newKws = keyword.trim().split(/\s+/).filter(Boolean);
    const allKeywords = [...selectedKeywords, ...newKws];
    if (allKeywords.length === 0 && brandFilter.selectedBrands.length === 0)
      return;

    const params = buildParams(allKeywords, {
      ...appliedFilters,
      brands: brandFilter.selectedBrands,
    });
    router.push(`/?${params.toString()}`);
  }

  function handleConfirmBrands() {
    const brands = brandFilter.confirmBrands();
    const newKws = keyword.trim().split(/\s+/).filter(Boolean);
    const allKeywords = [...selectedKeywords, ...newKws];
    if (allKeywords.length === 0 && brands.length === 0) return;

    const params = buildParams(allKeywords, { ...appliedFilters, brands });
    router.push(`/?${params.toString()}`);
  }

  function handleRemoveBrandFromBar(id: number) {
    const newBrands = brandFilter.selectedBrands.filter((b) => b.id !== id);
    brandFilter.setSelectedBrands(newBrands);
    const params = buildParams(selectedKeywords, {
      ...appliedFilters,
      brands: newBrands,
    });
    router.push(params.toString() ? `/?${params.toString()}` : "/");
  }

  function handleApplyFilters(filters: FilterValues) {
    setShowFilterPanel(false);
    brandFilter.setSelectedBrands(filters.brands);
    const params = buildParams(selectedKeywords, filters);
    router.push(params.toString() ? `/?${params.toString()}` : "/");
  }

  function handleBrandChangeFromFilter(brands: BrandSuggestion[]) {
    brandFilter.setSelectedBrands(brands);
    const params = buildParams(selectedKeywords, {
      ...appliedFilters,
      brands,
    });
    router.push(params.toString() ? `/?${params.toString()}` : "/");
  }

  function handleGoHome() {
    setKeyword("");
    setSelectedKeywords([]);
    brandFilter.setSelectedBrands([]);
    setAppliedFilters({
      onSaleOnly: false,
      priceMin: "",
      priceMax: "",
      sizes: [],
      brands: [],
    });
    search.resetSearch();
    router.push("/");
  }

  function handleItemClick(item: MercariItem) {
    trackItem(item);
    if (window.location.search) {
      sessionStorage.setItem(
        "merkori_search_state",
        JSON.stringify({
          key: window.location.search,
          items: search.items,
          nextPageToken: search.nextPageTokenRef.current,
          scrollY: window.scrollY,
        }),
      );
    }
  }

  function handleRemoveKeyword(index: number) {
    const newKeywords = selectedKeywords.filter((_, idx) => idx !== index);
    const params = buildParams(newKeywords, appliedFilters);
    router.push(params.toString() ? `/?${params.toString()}` : "/");
  }

  function handleRemoveFilterChip(
    type: "brand" | "size" | "price" | "onSaleOnly",
    id?: number,
  ) {
    const updated = { ...appliedFilters };
    if (type === "brand" && id !== undefined) {
      updated.brands = updated.brands.filter((b) => b.id !== id);
    } else if (type === "size" && id !== undefined) {
      updated.sizes = updated.sizes.filter((s) => s.id !== id);
    } else if (type === "price") {
      updated.priceMin = "";
      updated.priceMax = "";
    } else if (type === "onSaleOnly") {
      updated.onSaleOnly = false;
    }
    const params = buildParams(selectedKeywords, updated);
    router.push(params.toString() ? `/?${params.toString()}` : "/");
  }

  const activeFilterCount =
    (appliedFilters.onSaleOnly ? 1 : 0) +
    (appliedFilters.priceMin || appliedFilters.priceMax ? 1 : 0) +
    appliedFilters.sizes.length +
    appliedFilters.brands.length;

  const showRecently = !search.hasSearched && recentlyViewed.length > 0;

  return (
    <main className="min-h-screen bg-bg p-4 text-text-primary sm:p-6">
      <div className="mx-auto max-w-5xl">
        <AppHeader
          user={user}
          isDark={isDark}
          tab={tab}
          favorites={favorites}
          inAppBrowser={inAppBrowser}
          onGoHome={handleGoHome}
          onToggleTheme={toggle}
          onSignIn={signIn}
          onSignOut={signOut}
          onTabChange={handleTabChange}
        />

        {tab === "search" && (
          <>
            <SearchBar
              keyword={keyword}
              selectedKeywords={selectedKeywords}
              selectedBrands={brandFilter.selectedBrands}
              loading={search.loading}
              items={search.items}
              onKeywordChange={setKeyword}
              onRemoveKeyword={handleRemoveKeyword}
              onRemoveBrand={handleRemoveBrandFromBar}
              onSearch={handleSearch}
              onOpenBrandModal={() =>
                brandFilter.openBrandModal(brandFilter.selectedBrands)
              }
            />

            {/* Mobile filter button */}
            {search.hasSearched && (
              <div className="mb-3 flex lg:hidden">
                <button
                  onClick={() => setShowFilterPanel(true)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    activeFilterCount > 0
                      ? "border-accent/30 bg-accent/10 text-accent"
                      : "border-border bg-surface text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                    />
                  </svg>
                  필터링
                  {activeFilterCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Two-column layout on PC */}
            <div className="lg:flex lg:items-start lg:gap-6">
              {/* Main content */}
              <div className="min-w-0 lg:flex-1">
                {/* Active filter chips */}
                {search.hasSearched && activeFilterCount > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {appliedFilters.onSaleOnly && (
                      <span className="flex items-center gap-0.5 rounded-full border border-accent/30 bg-accent/15 text-xs text-accent">
                        <span className="py-0.5 pr-1 pl-2.5 font-medium">
                          판매중만
                        </span>
                        <button
                          onClick={() => handleRemoveFilterChip("onSaleOnly")}
                          className="py-0.5 pr-2 opacity-60 hover:opacity-100"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {(appliedFilters.priceMin || appliedFilters.priceMax) && (
                      <span className="flex items-center gap-0.5 rounded-full border border-accent/30 bg-accent/15 text-xs text-accent">
                        <span className="py-0.5 pr-1 pl-2.5 font-medium">
                          {appliedFilters.priceMin
                            ? `¥${appliedFilters.priceMin}`
                            : ""}
                          {" ~ "}
                          {appliedFilters.priceMax
                            ? `¥${appliedFilters.priceMax}`
                            : ""}
                        </span>
                        <button
                          onClick={() => handleRemoveFilterChip("price")}
                          className="py-0.5 pr-2 opacity-60 hover:opacity-100"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {appliedFilters.sizes.map((s) => (
                      <span
                        key={s.id}
                        className="flex items-center gap-0.5 rounded-full border border-accent/30 bg-accent/15 text-xs text-accent"
                      >
                        <span className="py-0.5 pr-1 pl-2.5 font-medium">
                          {s.name}
                        </span>
                        <button
                          onClick={() => handleRemoveFilterChip("size", s.id)}
                          className="py-0.5 pr-2 opacity-60 hover:opacity-100"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {appliedFilters.brands.map((b) => (
                      <span
                        key={b.id}
                        className="flex items-center gap-0.5 rounded-full border border-border bg-surface-raised text-xs text-text-secondary"
                      >
                        <span className="py-0.5 pr-1 pl-2.5">{b.name}</span>
                        <button
                          onClick={() => handleRemoveFilterChip("brand", b.id)}
                          className="py-0.5 pr-2 opacity-60 hover:opacity-100"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {search.error && (
                  <div className="mb-4 rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm text-accent">
                    {search.error}
                  </div>
                )}

                {showRecently && (
                  <RecentlyViewedSection
                    items={recentlyViewed}
                    favoriteIds={favoriteIds}
                    onFavorite={user ? toggleFavorite : undefined}
                    onItemClick={handleItemClick}
                  />
                )}

                <ItemGrid
                  items={search.items}
                  loading={search.loading}
                  hasSearched={search.hasSearched}
                  favoriteIds={favoriteIds}
                  sentinelRef={search.sentinelRef}
                  onFavorite={user ? toggleFavorite : undefined}
                  onItemClick={handleItemClick}
                />
              </div>

              {/* PC sidebar filter */}
              {search.hasSearched && (
                <aside className="sticky top-6 hidden w-64 flex-shrink-0 self-start lg:block">
                  <FilterPanel
                    isSidebar
                    initialValues={appliedFilters}
                    onApply={handleApplyFilters}
                    onBrandChange={handleBrandChangeFromFilter}
                  />
                </aside>
              )}
            </div>
          </>
        )}

        {tab === "favorites" && user && (
          <FavoritesTab
            favorites={favorites}
            onFavorite={toggleFavorite}
            onItemClick={handleItemClick}
          />
        )}
      </div>

      {brandFilter.showBrandModal && (
        <BrandModal
          modalBrandInput={brandFilter.modalBrandInput}
          modalBrandSuggestions={brandFilter.modalBrandSuggestions}
          tempSelectedBrands={brandFilter.tempSelectedBrands}
          onModalBrandInput={brandFilter.handleModalBrandInput}
          onAddBrand={brandFilter.addTempBrand}
          onRemoveTempBrand={brandFilter.removeTempBrand}
          onClearTempBrands={brandFilter.clearTempBrands}
          onCancel={brandFilter.closeBrandModal}
          onConfirm={handleConfirmBrands}
        />
      )}

      {/* Mobile filter drawer */}
      {search.hasSearched && (
        <FilterPanel
          isOpen={showFilterPanel}
          initialValues={appliedFilters}
          onApply={handleApplyFilters}
          onBrandChange={handleBrandChangeFromFilter}
          onClose={() => setShowFilterPanel(false)}
        />
      )}
    </main>
  );
}
