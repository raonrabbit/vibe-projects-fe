"use client";

import { startTransition, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useTheme } from "@/features/theme/useTheme";
import { useAuth } from "@/features/auth/useAuth";
import { useFavorites } from "@/features/favorites/useFavorites";
import { useSearch } from "@/features/search/useSearch";
import { useBrandFilter } from "@/features/brand-filter/useBrandFilter";
import { useRecentlyViewed } from "@/features/recently-viewed/useRecentlyViewed";

import { AppHeader } from "@/widgets/AppHeader";
import { SearchBar } from "@/widgets/SearchBar";
import { BrandModal } from "@/widgets/BrandModal";
import { FilterPanel } from "@/widgets/FilterPanel";
import { ItemGrid } from "@/widgets/ItemGrid";
import { FavoritesTab } from "@/widgets/FavoritesTab";
import { RecentlyViewedSection } from "@/widgets/RecentlyViewedSection";

import type {
    MercariItem,
    BrandSuggestion,
    SizeOption,
} from "@/entities/item/model";
import type { FilterValues } from "@/widgets/FilterPanel";

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
    const [tab, setTab] = useState<Tab>("search");
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

        const bIds = bIdsStr
            ? bIdsStr.split(",").map(Number).filter(Boolean)
            : [];
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    function buildParams(
        keywords: string[],
        filters: FilterValues,
    ): URLSearchParams {
        const params = new URLSearchParams();
        if (keywords.length > 0) params.set("q", keywords.join(" "));
        if (filters.brands.length > 0) {
            params.set("brandId", filters.brands.map((b) => b.id).join(","));
            params.set(
                "brandName",
                filters.brands.map((b) => b.name).join(","),
            );
        }
        if (filters.onSaleOnly) params.set("onSaleOnly", "true");
        if (filters.priceMin) params.set("priceMin", filters.priceMin);
        if (filters.priceMax) params.set("priceMax", filters.priceMax);
        if (filters.sizes.length > 0) {
            params.set("sizeId", filters.sizes.map((s) => s.id).join(","));
            params.set("sizeName", filters.sizes.map((s) => s.name).join(","));
            params.set(
                "sizeGroup",
                filters.sizes.map((s) => s.group).join(","),
            );
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
        <main className="min-h-screen p-4 sm:p-6 bg-bg text-text-primary">
            <div className="max-w-5xl mx-auto">
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
                    onTabChange={setTab}
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
                                brandFilter.openBrandModal(
                                    brandFilter.selectedBrands,
                                )
                            }
                        />

                        {/* Mobile filter button */}
                        {search.hasSearched && (
                            <div className="flex lg:hidden mb-3">
                                <button
                                    onClick={() => setShowFilterPanel(true)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                                        activeFilterCount > 0
                                            ? "bg-accent/10 border-accent/30 text-accent"
                                            : "bg-surface border-border text-text-secondary hover:text-text-primary"
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
                                        <span className="w-4 h-4 rounded-full bg-accent text-white text-[9px] flex items-center justify-center font-bold">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Two-column layout on PC */}
                        <div className="lg:flex lg:gap-6 lg:items-start">
                            {/* Main content */}
                            <div className="min-w-0 lg:flex-1">
                                {/* Active filter chips */}
                                {search.hasSearched &&
                                    activeFilterCount > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {appliedFilters.onSaleOnly && (
                                                <span className="flex items-center gap-0.5 text-xs rounded-full bg-accent/15 border border-accent/30 text-accent">
                                                    <span className="pl-2.5 pr-1 py-0.5 font-medium">
                                                        판매중만
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveFilterChip(
                                                                "onSaleOnly",
                                                            )
                                                        }
                                                        className="pr-2 py-0.5 opacity-60 hover:opacity-100"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            )}
                                            {(appliedFilters.priceMin ||
                                                appliedFilters.priceMax) && (
                                                <span className="flex items-center gap-0.5 text-xs rounded-full bg-accent/15 border border-accent/30 text-accent">
                                                    <span className="pl-2.5 pr-1 py-0.5 font-medium">
                                                        {appliedFilters.priceMin
                                                            ? `¥${appliedFilters.priceMin}`
                                                            : ""}
                                                        {" ~ "}
                                                        {appliedFilters.priceMax
                                                            ? `¥${appliedFilters.priceMax}`
                                                            : ""}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveFilterChip(
                                                                "price",
                                                            )
                                                        }
                                                        className="pr-2 py-0.5 opacity-60 hover:opacity-100"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            )}
                                            {appliedFilters.sizes.map((s) => (
                                                <span
                                                    key={s.id}
                                                    className="flex items-center gap-0.5 text-xs rounded-full bg-accent/15 border border-accent/30 text-accent"
                                                >
                                                    <span className="pl-2.5 pr-1 py-0.5 font-medium">
                                                        {s.name}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveFilterChip(
                                                                "size",
                                                                s.id,
                                                            )
                                                        }
                                                        className="pr-2 py-0.5 opacity-60 hover:opacity-100"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                            {appliedFilters.brands.map((b) => (
                                                <span
                                                    key={b.id}
                                                    className="flex items-center gap-0.5 text-xs rounded-full bg-surface-raised border border-border text-text-secondary"
                                                >
                                                    <span className="pl-2.5 pr-1 py-0.5">
                                                        {b.name}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveFilterChip(
                                                                "brand",
                                                                b.id,
                                                            )
                                                        }
                                                        className="pr-2 py-0.5 opacity-60 hover:opacity-100"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                {search.error && (
                                    <div className="rounded-lg p-3 mb-4 text-sm bg-accent/10 border border-accent/30 text-accent">
                                        {search.error}
                                    </div>
                                )}

                                {showRecently && (
                                    <RecentlyViewedSection
                                        items={recentlyViewed}
                                        favoriteIds={favoriteIds}
                                        onFavorite={
                                            user ? toggleFavorite : undefined
                                        }
                                        onItemClick={handleItemClick}
                                    />
                                )}

                                <ItemGrid
                                    items={search.items}
                                    loading={search.loading}
                                    hasSearched={search.hasSearched}
                                    favoriteIds={favoriteIds}
                                    sentinelRef={search.sentinelRef}
                                    onFavorite={
                                        user ? toggleFavorite : undefined
                                    }
                                    onItemClick={handleItemClick}
                                />
                            </div>

                            {/* PC sidebar filter */}
                            {search.hasSearched && (
                                <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-6 self-start">
                                    <FilterPanel
                                        isSidebar
                                        initialValues={appliedFilters}
                                        onApply={handleApplyFilters}
                                        onBrandChange={
                                            handleBrandChangeFromFilter
                                        }
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
