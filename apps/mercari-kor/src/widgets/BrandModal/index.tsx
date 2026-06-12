"use client";

import type { BrandSuggestion } from "@/entities/item/model";

interface BrandModalProps {
  modalBrandInput: string;
  modalBrandSuggestions: BrandSuggestion[];
  tempSelectedBrands: BrandSuggestion[];
  onModalBrandInput: (v: string) => void;
  onAddBrand: (brand: BrandSuggestion) => void;
  onRemoveTempBrand: (id: number) => void;
  onClearTempBrands: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function BrandModal({
  modalBrandInput,
  modalBrandSuggestions,
  tempSelectedBrands,
  onModalBrandInput,
  onAddBrand,
  onRemoveTempBrand,
  onClearTempBrands,
  onCancel,
  onConfirm,
}: BrandModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-text-primary">
            브랜드 필터링
          </h2>
          <button
            onClick={onCancel}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-raised text-xs text-text-primary opacity-50 transition-opacity hover:opacity-100"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pt-4 pb-2">
          <input
            type="text"
            value={modalBrandInput}
            onChange={(e) => onModalBrandInput(e.target.value)}
            placeholder="브랜드명 검색..."
            autoFocus
            className="w-full rounded-xl border border-border bg-surface-raised px-3.5 py-2.5 text-sm focus:outline-none"
          />
        </div>

        {modalBrandSuggestions.length > 0 && (
          <div
            className="mx-5 mb-2 scrollbar-hide overflow-y-auto rounded-xl border border-border bg-surface-raised"
            style={{ maxHeight: "180px" }}
          >
            {modalBrandSuggestions.map((b, i) => {
              const alreadySelected = tempSelectedBrands.some(
                (s) => s.id === b.id,
              );
              return (
                <button
                  key={b.id}
                  onClick={() => onAddBrand(b)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface ${
                    i < modalBrandSuggestions.length - 1
                      ? "border-b border-border"
                      : ""
                  } ${alreadySelected ? "text-text-secondary" : "text-text-primary"}`}
                >
                  <span>{b.name}</span>
                  {alreadySelected && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="text-accent"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="min-h-[60px] px-5 pb-4">
          {tempSelectedBrands.length > 0 ? (
            <>
              <p className="mb-2 text-xs text-text-secondary">선택된 브랜드</p>
              <div className="flex flex-wrap gap-1.5">
                {tempSelectedBrands.map((b) => (
                  <span
                    key={b.id}
                    className="flex items-center gap-0.5 rounded-full border border-accent/30 bg-accent/15 text-xs text-accent"
                  >
                    <span className="py-0.5 pr-1 pl-2.5 font-medium">
                      {b.name}
                    </span>
                    <button
                      onClick={() => onRemoveTempBrand(b.id)}
                      className="py-0.5 pr-2 opacity-60 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-text-secondary">
              위에서 브랜드를 검색해 선택하세요
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          {tempSelectedBrands.length > 0 && (
            <button
              onClick={onClearTempBrands}
              className="rounded-lg px-3 py-1.5 text-xs text-text-secondary"
            >
              초기화
            </button>
          )}
          <button
            onClick={onCancel}
            className="rounded-lg border border-border bg-surface-raised px-4 py-1.5 text-sm text-text-secondary"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
