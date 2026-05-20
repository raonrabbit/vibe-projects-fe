"use client";

import { useState, useRef, useEffect } from "react";
import type { BrandSuggestion, SizeOption } from "@/entities/item/model";

export interface FilterValues {
    onSaleOnly: boolean;
    priceMin: string;
    priceMax: string;
    sizes: SizeOption[];
    brands: BrandSuggestion[];
}

interface FilterPanelProps {
    isSidebar?: boolean;
    isOpen?: boolean;
    initialValues: FilterValues;
    onApply: (values: FilterValues) => void;
    onBrandChange: (brands: BrandSuggestion[]) => void;
    onClose?: () => void;
}

export function FilterPanel({
    isSidebar = false,
    isOpen = false,
    initialValues,
    onApply,
    onBrandChange,
    onClose,
}: FilterPanelProps) {
    const [onSaleOnly, setOnSaleOnly] = useState(initialValues.onSaleOnly);
    const [priceMin, setPriceMin] = useState(initialValues.priceMin);
    const [priceMax, setPriceMax] = useState(initialValues.priceMax);
    const [sizes, setSizes] = useState<SizeOption[]>([...initialValues.sizes]);
    const [brands, setBrands] = useState<BrandSuggestion[]>([
        ...initialValues.brands,
    ]);
    const [allSizes, setAllSizes] = useState<SizeOption[]>([]);
    const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
    const [brandInput, setBrandInput] = useState("");
    const [brandSuggestions, setBrandSuggestions] = useState<BrandSuggestion[]>(
        [],
    );
    const brandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        fetch("/api/mercari/sizes")
            .then((r) => r.json())
            .then((data) => setAllSizes(data.sizes ?? []))
            .catch(() => {});
    }, []);

    // Sidebar: sync when applied filters change (prop → local state sync is intentional here)
    useEffect(() => {
        if (!isSidebar) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOnSaleOnly(initialValues.onSaleOnly);
        setPriceMin(initialValues.priceMin);
        setPriceMax(initialValues.priceMax);
        setSizes([...initialValues.sizes]);
        setBrands([...initialValues.brands]);
        setBrandInput("");
        setBrandSuggestions([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValues]);

    // Drawer: sync when opened (reset local edits to applied state on open)
    useEffect(() => {
        if (isSidebar || !isOpen) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOnSaleOnly(initialValues.onSaleOnly);
        setPriceMin(initialValues.priceMin);
        setPriceMax(initialValues.priceMax);
        setSizes([...initialValues.sizes]);
        setBrands([...initialValues.brands]);
        setBrandInput("");
        setBrandSuggestions([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    function handleBrandInput(value: string) {
        setBrandInput(value);
        if (brandTimerRef.current) clearTimeout(brandTimerRef.current);
        if (!value.trim()) {
            setBrandSuggestions([]);
            return;
        }
        brandTimerRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `/api/mercari/brands?q=${encodeURIComponent(value)}`,
                );
                if (res.ok) {
                    const data = await res.json();
                    setBrandSuggestions(data.brands ?? []);
                }
            } catch {
                // ignore
            }
        }, 300);
    }

    function addBrand(brand: BrandSuggestion) {
        if (brands.some((b) => b.id === brand.id)) {
            setBrandInput("");
            setBrandSuggestions([]);
            return;
        }
        const newBrands = [...brands, brand];
        setBrands(newBrands);
        setBrandInput("");
        setBrandSuggestions([]);
        onBrandChange(newBrands);
    }

    function removeBrand(id: number) {
        const newBrands = brands.filter((b) => b.id !== id);
        setBrands(newBrands);
        onBrandChange(newBrands);
    }

    function toggleGroup(group: string) {
        setOpenGroups((prev) => {
            const next = new Set(prev);
            if (next.has(group)) next.delete(group);
            else next.add(group);
            return next;
        });
    }

    function toggleSize(size: SizeOption) {
        setSizes((prev) =>
            prev.some((s) => s.id === size.id)
                ? prev.filter((s) => s.id !== size.id)
                : [...prev, size],
        );
    }

    function handleReset() {
        setOnSaleOnly(false);
        setPriceMin("");
        setPriceMax("");
        setSizes([]);
        setBrands([]);
        setBrandInput("");
        setBrandSuggestions([]);
        onApply({
            onSaleOnly: false,
            priceMin: "",
            priceMax: "",
            sizes: [],
            brands: [],
        });
    }

    function handleApply() {
        onApply({ onSaleOnly, priceMin, priceMax, sizes, brands });
    }

    const groups = Array.from(new Set(allSizes.map((s) => s.group)));

    const hasChanges =
        onSaleOnly ||
        priceMin ||
        priceMax ||
        sizes.length > 0 ||
        brands.length > 0;

    // Apply button active only when non-brand filters differ from applied state
    const isDirty =
        onSaleOnly !== initialValues.onSaleOnly ||
        priceMin !== initialValues.priceMin ||
        priceMax !== initialValues.priceMax ||
        sizes.length !== initialValues.sizes.length ||
        sizes.some((s) => !initialValues.sizes.some((x) => x.id === s.id));

    const filterBody = (
        <div className="flex-1 overflow-y-auto min-h-0">
            {/* 판매중만 */}
            <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">
                        판매중만
                    </span>
                    <button
                        onClick={() => setOnSaleOnly((v) => !v)}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                            onSaleOnly
                                ? "bg-accent"
                                : "bg-surface-raised border border-border"
                        }`}
                    >
                        <span
                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                onSaleOnly
                                    ? "translate-x-[22px]"
                                    : "translate-x-0.5"
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* 가격 */}
            <div className="px-5 py-4 border-b border-border">
                <p className="text-sm font-medium text-text-primary mb-3">
                    가격
                </p>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={priceMin}
                        onChange={(e) =>
                            setPriceMin(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        placeholder="최소"
                        className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm bg-surface-raised border border-border focus:outline-none focus:border-accent text-text-primary"
                    />
                    <span className="text-xs text-text-secondary flex-shrink-0">
                        ~
                    </span>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={priceMax}
                        onChange={(e) =>
                            setPriceMax(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        placeholder="최대"
                        className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm bg-surface-raised border border-border focus:outline-none focus:border-accent text-text-primary"
                    />
                    <span className="text-xs text-text-secondary flex-shrink-0">
                        ¥
                    </span>
                </div>
            </div>

            {/* 사이즈 */}
            <div>
                <p className="px-5 pt-4 pb-3 text-sm font-medium text-text-primary">
                    사이즈
                </p>
                {allSizes.length === 0 ? (
                    <p className="px-5 pb-4 text-xs text-text-secondary">
                        로딩 중...
                    </p>
                ) : (
                    <div className="pb-2">
                        {groups.map((group) => {
                            const isGroupOpen = openGroups.has(group);
                            const groupSizes = allSizes.filter(
                                (s) => s.group === group,
                            );
                            const selectedCount = groupSizes.filter((s) =>
                                sizes.some((x) => x.id === s.id),
                            ).length;
                            return (
                                <div key={group}>
                                    <button
                                        onClick={() => toggleGroup(group)}
                                        className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-surface-raised transition-colors"
                                    >
                                        <span className="text-xs text-text-secondary flex items-center gap-1.5">
                                            {group}
                                            {selectedCount > 0 && (
                                                <span className="w-4 h-4 rounded-full bg-accent text-white text-[9px] flex items-center justify-center font-bold">
                                                    {selectedCount}
                                                </span>
                                            )}
                                        </span>
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                            className={`text-text-secondary transition-transform ${isGroupOpen ? "rotate-180" : ""}`}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                    <div
                                        className={`grid transition-all duration-200 ease-in-out ${
                                            isGroupOpen
                                                ? "grid-rows-[1fr]"
                                                : "grid-rows-[0fr]"
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="flex flex-wrap gap-1.5 px-5 pt-2 pb-4">
                                                {groupSizes.map((size) => {
                                                    const selected = sizes.some(
                                                        (s) => s.id === size.id,
                                                    );
                                                    return (
                                                        <button
                                                            key={size.id}
                                                            onClick={() =>
                                                                toggleSize(size)
                                                            }
                                                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                                                                selected
                                                                    ? "bg-accent/15 text-accent border-accent/30"
                                                                    : "bg-surface-raised text-text-secondary border-border hover:border-text-secondary"
                                                            }`}
                                                        >
                                                            {size.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );

    // Brand section — immediate apply, visually distinct
    const brandSection = (
        <div className="flex-shrink-0 border-t-2 border-border bg-surface-raised/50 px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
                <p className="text-sm font-medium text-text-primary">브랜드</p>
                <span className="text-[10px] font-medium text-text-secondary bg-surface border border-border px-1.5 py-0.5 rounded-full leading-none">
                    즉시 반영
                </span>
            </div>
            <input
                type="text"
                value={brandInput}
                onChange={(e) => handleBrandInput(e.target.value)}
                placeholder="브랜드명 검색..."
                autoComplete="off"
                className="w-full px-3 py-2 rounded-lg text-sm bg-surface border border-border focus:outline-none focus:border-accent text-text-primary"
            />
            {brandSuggestions.length > 0 && (
                <div className="mt-1 rounded-lg overflow-hidden border border-border bg-surface">
                    {brandSuggestions.map((b, i) => (
                        <button
                            key={b.id}
                            onClick={() => addBrand(b)}
                            className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-surface-raised flex items-center justify-between ${
                                i < brandSuggestions.length - 1
                                    ? "border-b border-border"
                                    : ""
                            }`}
                        >
                            <span
                                className={
                                    brands.some((s) => s.id === b.id)
                                        ? "text-text-secondary"
                                        : "text-text-primary"
                                }
                            >
                                {b.name}
                            </span>
                            {brands.some((s) => s.id === b.id) && (
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    className="text-accent flex-shrink-0"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
            {brands.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {brands.map((b) => (
                        <span
                            key={b.id}
                            className="flex items-center gap-0.5 text-xs rounded-full bg-accent/15 border border-accent/30 text-accent"
                        >
                            <span className="pl-2.5 pr-1 py-0.5 font-medium">
                                {b.name}
                            </span>
                            <button
                                onClick={() => removeBrand(b.id)}
                                className="pr-2 py-0.5 opacity-60 hover:opacity-100"
                            >
                                ✕
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );

    if (isSidebar) {
        return (
            <div className="flex flex-col border border-border rounded-xl bg-surface overflow-hidden max-h-[calc(100vh-6rem)]">
                <div className="px-5 py-4 flex items-center justify-between border-b border-border flex-shrink-0">
                    <h2 className="text-sm font-semibold text-text-primary">
                        필터링
                    </h2>
                    {hasChanges && (
                        <button
                            onClick={handleReset}
                            className="text-sm font-medium text-accent"
                        >
                            클리어
                        </button>
                    )}
                </div>
                {filterBody}
                <div className="px-5 py-3 border-t border-border flex-shrink-0">
                    <button
                        onClick={handleApply}
                        disabled={!isDirty}
                        className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                            isDirty
                                ? "text-white bg-accent hover:bg-accent-hover cursor-pointer"
                                : "text-text-secondary bg-surface-raised opacity-40 cursor-not-allowed"
                        }`}
                    >
                        적용
                    </button>
                </div>
                {brandSection}
            </div>
        );
    }

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40"
                    onClick={onClose}
                />
            )}
            <div
                className={`fixed top-0 right-0 h-full z-50 w-80 flex flex-col bg-surface border-l border-border shadow-2xl transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="px-5 py-4 flex items-center justify-between border-b border-border flex-shrink-0">
                    <h2 className="text-sm font-semibold text-text-primary">
                        필터링
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs opacity-50 hover:opacity-100 transition-opacity bg-surface-raised text-text-primary"
                    >
                        ✕
                    </button>
                </div>
                {filterBody}
                <div className="px-5 py-4 border-t border-border flex items-center justify-end gap-2 flex-shrink-0">
                    {hasChanges && (
                        <button
                            onClick={handleReset}
                            className="px-3 py-1.5 rounded-lg text-xs text-text-secondary"
                        >
                            초기화
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm bg-surface-raised text-text-secondary border border-border"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={!isDirty}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            isDirty
                                ? "text-white bg-accent hover:bg-accent-hover cursor-pointer"
                                : "text-text-secondary bg-surface-raised border border-border opacity-40 cursor-not-allowed"
                        }`}
                    >
                        적용
                    </button>
                </div>
                {brandSection}
            </div>
        </>
    );
}
