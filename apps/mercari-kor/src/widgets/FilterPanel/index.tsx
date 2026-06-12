"use client";

import { useEffect, useRef, useState } from "react";

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

    setOnSaleOnly(initialValues.onSaleOnly);
    setPriceMin(initialValues.priceMin);
    setPriceMax(initialValues.priceMax);
    setSizes([...initialValues.sizes]);
    setBrands([...initialValues.brands]);
    setBrandInput("");
    setBrandSuggestions([]);
  }, [initialValues]);

  // Drawer: sync when opened (reset local edits to applied state on open)
  useEffect(() => {
    if (isSidebar || !isOpen) return;

    setOnSaleOnly(initialValues.onSaleOnly);
    setPriceMin(initialValues.priceMin);
    setPriceMax(initialValues.priceMax);
    setSizes([...initialValues.sizes]);
    setBrands([...initialValues.brands]);
    setBrandInput("");
    setBrandSuggestions([]);
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
    onSaleOnly || priceMin || priceMax || sizes.length > 0 || brands.length > 0;

  // Apply button active only when non-brand filters differ from applied state
  const isDirty =
    onSaleOnly !== initialValues.onSaleOnly ||
    priceMin !== initialValues.priceMin ||
    priceMax !== initialValues.priceMax ||
    sizes.length !== initialValues.sizes.length ||
    sizes.some((s) => !initialValues.sizes.some((x) => x.id === s.id));

  const filterBody = (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {/* 판매중만 */}
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">
            판매중만
          </span>
          <button
            onClick={() => setOnSaleOnly((v) => !v)}
            className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
              onSaleOnly
                ? "bg-accent"
                : "border border-border bg-surface-raised"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                onSaleOnly ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 가격 */}
      <div className="border-b border-border px-5 py-4">
        <p className="mb-3 text-sm font-medium text-text-primary">가격</p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="최소"
            className="min-w-0 flex-1 rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
          />
          <span className="flex-shrink-0 text-xs text-text-secondary">~</span>
          <input
            type="text"
            inputMode="numeric"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="최대"
            className="min-w-0 flex-1 rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
          />
          <span className="flex-shrink-0 text-xs text-text-secondary">¥</span>
        </div>
      </div>

      {/* 사이즈 */}
      <div>
        <p className="px-5 pt-4 pb-3 text-sm font-medium text-text-primary">
          사이즈
        </p>
        {allSizes.length === 0 ? (
          <p className="px-5 pb-4 text-xs text-text-secondary">로딩 중...</p>
        ) : (
          <div className="pb-2">
            {groups.map((group) => {
              const isGroupOpen = openGroups.has(group);
              const groupSizes = allSizes.filter((s) => s.group === group);
              const selectedCount = groupSizes.filter((s) =>
                sizes.some((x) => x.id === s.id),
              ).length;
              return (
                <div key={group}>
                  <button
                    onClick={() => toggleGroup(group)}
                    className="flex w-full items-center justify-between px-5 py-2.5 transition-colors hover:bg-surface-raised"
                  >
                    <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                      {group}
                      {selectedCount > 0 && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
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
                      isGroupOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-wrap gap-1.5 px-5 pt-2 pb-4">
                        {groupSizes.map((size) => {
                          const selected = sizes.some((s) => s.id === size.id);
                          return (
                            <button
                              key={size.id}
                              onClick={() => toggleSize(size)}
                              className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                                selected
                                  ? "border-accent/30 bg-accent/15 text-accent"
                                  : "border-border bg-surface-raised text-text-secondary hover:border-text-secondary"
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
      <div className="mb-3 flex items-center gap-2">
        <p className="text-sm font-medium text-text-primary">브랜드</p>
        <span className="rounded-full border border-border bg-surface px-1.5 py-0.5 text-[10px] leading-none font-medium text-text-secondary">
          즉시 반영
        </span>
      </div>
      <input
        type="text"
        value={brandInput}
        onChange={(e) => handleBrandInput(e.target.value)}
        placeholder="브랜드명 검색..."
        autoComplete="off"
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
      />
      {brandSuggestions.length > 0 && (
        <div className="mt-1 overflow-hidden rounded-lg border border-border bg-surface">
          {brandSuggestions.map((b, i) => (
            <button
              key={b.id}
              onClick={() => addBrand(b)}
              className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-raised ${
                i < brandSuggestions.length - 1 ? "border-b border-border" : ""
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
                  className="flex-shrink-0 text-accent"
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
        <div className="mt-3 flex flex-wrap gap-1.5">
          {brands.map((b) => (
            <span
              key={b.id}
              className="flex items-center gap-0.5 rounded-full border border-accent/30 bg-accent/15 text-xs text-accent"
            >
              <span className="py-0.5 pr-1 pl-2.5 font-medium">{b.name}</span>
              <button
                onClick={() => removeBrand(b.id)}
                className="py-0.5 pr-2 opacity-60 hover:opacity-100"
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
      <div className="flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-text-primary">필터링</h2>
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
        <div className="flex-shrink-0 border-t border-border px-5 py-3">
          <button
            onClick={handleApply}
            disabled={!isDirty}
            className={`w-full rounded-lg py-2 text-sm font-semibold transition-colors ${
              isDirty
                ? "cursor-pointer bg-accent text-white hover:bg-accent-hover"
                : "cursor-not-allowed bg-surface-raised text-text-secondary opacity-40"
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
        <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-80 flex-col border-l border-border bg-surface shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-text-primary">필터링</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-raised text-xs text-text-primary opacity-50 transition-opacity hover:opacity-100"
          >
            ✕
          </button>
        </div>
        {filterBody}
        <div className="flex flex-shrink-0 items-center justify-end gap-2 border-t border-border px-5 py-4">
          {hasChanges && (
            <button
              onClick={handleReset}
              className="rounded-lg px-3 py-1.5 text-xs text-text-secondary"
            >
              초기화
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-surface-raised px-4 py-2 text-sm text-text-secondary"
          >
            취소
          </button>
          <button
            onClick={handleApply}
            disabled={!isDirty}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              isDirty
                ? "cursor-pointer bg-accent text-white hover:bg-accent-hover"
                : "cursor-not-allowed border border-border bg-surface-raised text-text-secondary opacity-40"
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
