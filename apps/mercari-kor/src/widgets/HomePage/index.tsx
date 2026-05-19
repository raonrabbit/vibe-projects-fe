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
import { ItemGrid } from "@/widgets/ItemGrid";
import { FavoritesTab } from "@/widgets/FavoritesTab";
import { RecentlyViewedSection } from "@/widgets/RecentlyViewedSection";

import type { MercariItem } from "@/entities/item/model";

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
    const [onSaleOnly, setOnSaleOnly] = useState(false);
    const [tab, setTab] = useState<Tab>("search");

    // Sync URL params → state + trigger search
    useEffect(() => {
        const q = searchParams.get("q") ?? "";
        const bIdsStr = searchParams.get("brandId") ?? "";
        const bNamesStr = searchParams.get("brandName") ?? "";
        const onSaleOnlyParam = searchParams.get("onSaleOnly") === "true";

        const bIds = bIdsStr
            ? bIdsStr.split(",").map(Number).filter(Boolean)
            : [];
        const bNames = bNamesStr ? bNamesStr.split(",") : [];
        const brands = bIds.map((id, i) => ({ id, name: bNames[i] ?? "" }));

        if (!q && brands.length === 0) {
            search.resetSearch();
            startTransition(() => {
                setSelectedKeywords([]);
                brandFilter.setSelectedBrands([]);
            });
            return;
        }

        const keywords = q ? q.split(" ").filter(Boolean) : [];
        startTransition(() => {
            setKeyword("");
            setSelectedKeywords(keywords);
            brandFilter.setSelectedBrands(brands);
            setOnSaleOnly(onSaleOnlyParam);
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
                        onSaleOnlyParam,
                        cached.items,
                        cached.nextPageToken,
                        cached.scrollY,
                    );
                    return;
                }
            } catch {
                // ignore malformed cache
            }
        }

        search.startSearch(keywords, brands, onSaleOnlyParam);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    function handleSearch() {
        const newKws = keyword.trim().split(/\s+/).filter(Boolean);
        const allKeywords = [...selectedKeywords, ...newKws];

        if (allKeywords.length === 0 && brandFilter.selectedBrands.length === 0)
            return;

        const params = new URLSearchParams();
        if (allKeywords.length > 0) params.set("q", allKeywords.join(" "));
        if (brandFilter.selectedBrands.length > 0) {
            params.set(
                "brandId",
                brandFilter.selectedBrands.map((b) => b.id).join(","),
            );
            params.set(
                "brandName",
                brandFilter.selectedBrands.map((b) => b.name).join(","),
            );
        }
        if (onSaleOnly) params.set("onSaleOnly", "true");
        router.push(`/?${params.toString()}`);
    }

    function handleToggleOnSaleOnly() {
        const next = !onSaleOnly;
        const params = new URLSearchParams(searchParams.toString());
        if (next) params.set("onSaleOnly", "true");
        else params.delete("onSaleOnly");
        router.push(`/?${params.toString()}`);
    }

    function handleGoHome() {
        setKeyword("");
        setSelectedKeywords([]);
        brandFilter.setSelectedBrands([]);
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
        const params = new URLSearchParams();
        if (newKeywords.length > 0) params.set("q", newKeywords.join(" "));
        if (brandFilter.selectedBrands.length > 0) {
            params.set(
                "brandId",
                brandFilter.selectedBrands.map((b) => b.id).join(","),
            );
            params.set(
                "brandName",
                brandFilter.selectedBrands.map((b) => b.name).join(","),
            );
        }
        if (onSaleOnly) params.set("onSaleOnly", "true");
        router.push(params.toString() ? `/?${params.toString()}` : "/");
    }

    function handleRemoveBrand(id: number) {
        const newBrands = brandFilter.selectedBrands.filter((b) => b.id !== id);
        const params = new URLSearchParams();
        if (selectedKeywords.length > 0)
            params.set("q", selectedKeywords.join(" "));
        if (newBrands.length > 0) {
            params.set("brandId", newBrands.map((b) => b.id).join(","));
            params.set("brandName", newBrands.map((b) => b.name).join(","));
        }
        if (onSaleOnly) params.set("onSaleOnly", "true");
        router.push(params.toString() ? `/?${params.toString()}` : "/");
    }

    function handleConfirmBrands() {
        const brands = brandFilter.confirmBrands();
        const newKws = keyword.trim().split(/\s+/).filter(Boolean);
        const allKeywords = [...selectedKeywords, ...newKws];
        if (allKeywords.length === 0 && brands.length === 0) return;

        const params = new URLSearchParams();
        if (allKeywords.length > 0) params.set("q", allKeywords.join(" "));
        if (brands.length > 0) {
            params.set("brandId", brands.map((b) => b.id).join(","));
            params.set("brandName", brands.map((b) => b.name).join(","));
        }
        if (onSaleOnly) params.set("onSaleOnly", "true");
        router.push(`/?${params.toString()}`);
    }

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
                            onRemoveBrand={handleRemoveBrand}
                            onSearch={handleSearch}
                            onOpenBrandModal={() =>
                                brandFilter.openBrandModal(
                                    brandFilter.selectedBrands,
                                )
                            }
                        />

                        {search.hasSearched && (
                            <div className="flex justify-end mb-3">
                                <button
                                    onClick={handleToggleOnSaleOnly}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                                        onSaleOnly
                                            ? "bg-accent/15 text-accent border-accent/30"
                                            : "bg-surface-raised text-text-secondary border-border"
                                    }`}
                                >
                                    <span
                                        className={`inline-block w-1.5 h-1.5 rounded-full ${
                                            onSaleOnly
                                                ? "bg-accent"
                                                : "bg-text-secondary"
                                        }`}
                                    />
                                    판매중만
                                </button>
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
                                onFavorite={user ? toggleFavorite : undefined}
                                onItemClick={handleItemClick}
                            />
                        )}

                        <ItemGrid
                            items={search.items}
                            loading={search.loading}
                            favoriteIds={favoriteIds}
                            sentinelRef={search.sentinelRef}
                            onFavorite={user ? toggleFavorite : undefined}
                            onItemClick={handleItemClick}
                        />
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
        </main>
    );
}
