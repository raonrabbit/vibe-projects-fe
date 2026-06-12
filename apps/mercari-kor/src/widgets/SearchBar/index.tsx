"use client";

import type { BrandSuggestion, MercariItem } from "@/entities/item/model";

interface SearchBarProps {
  keyword: string;
  selectedKeywords: string[];
  selectedBrands: BrandSuggestion[];
  loading: boolean;
  items: MercariItem[];
  onKeywordChange: (v: string) => void;
  onRemoveKeyword: (index: number) => void;
  onRemoveBrand: (id: number) => void;
  onSearch: () => void;
  onOpenBrandModal: () => void;
}

export function SearchBar({
  keyword,
  selectedKeywords,
  selectedBrands,
  loading,
  items,
  onKeywordChange,
  onRemoveKeyword,
  onRemoveBrand,
  onSearch,
  onOpenBrandModal,
}: SearchBarProps) {
  return (
    <div className="mb-4">
      <div className="flex min-h-[52px] flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2.5">
        {selectedKeywords.map((kw, index) => (
          <span
            key={`${kw}-${index}`}
            className="flex flex-shrink-0 items-center gap-0.5 rounded-full border border-border bg-surface-raised text-xs text-text-secondary"
          >
            <span className="py-0.5 pr-1 pl-2.5">{kw}</span>
            <button
              onClick={() => onRemoveKeyword(index)}
              className="py-0.5 pr-2 opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </span>
        ))}

        {selectedBrands.map((b) => (
          <span
            key={b.id}
            className="flex flex-shrink-0 items-center gap-0.5 rounded-full border border-accent/30 bg-accent/15 text-xs text-accent"
          >
            <span className="py-0.5 pr-1 pl-2.5 font-medium">{b.name}</span>
            <button
              onClick={() => onRemoveBrand(b.id)}
              className="py-0.5 pr-2 opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </span>
        ))}

        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder={
            selectedKeywords.length > 0 || selectedBrands.length > 0
              ? "추가 입력..."
              : "검색어 입력"
          }
          className="min-w-[80px] flex-1 bg-transparent text-sm focus:outline-none"
        />

        <button
          onClick={onOpenBrandModal}
          className={`flex flex-shrink-0 items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            selectedBrands.length > 0
              ? "border-accent/30 bg-accent/15 text-accent"
              : "border-border bg-surface-raised text-text-secondary"
          }`}
        >
          <svg
            width="12"
            height="12"
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
          브랜드
          {selectedBrands.length > 0 ? ` (${selectedBrands.length})` : ""}
        </button>

        <button
          onClick={onSearch}
          disabled={loading}
          className="flex-shrink-0 rounded-lg bg-accent px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {loading && items.length === 0 ? "검색 중..." : "검색"}
        </button>
      </div>
    </div>
  );
}
