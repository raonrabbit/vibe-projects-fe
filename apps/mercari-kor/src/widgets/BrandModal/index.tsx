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
                className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden bg-surface border border-border"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 py-4 flex items-center justify-between border-b border-border">
                    <h2 className="text-sm font-semibold text-text-primary">
                        브랜드 필터링
                    </h2>
                    <button
                        onClick={onCancel}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs opacity-50 hover:opacity-100 transition-opacity bg-surface-raised text-text-primary"
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
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none bg-surface-raised border border-border"
                    />
                </div>

                {modalBrandSuggestions.length > 0 && (
                    <div
                        className="mx-5 mb-2 rounded-xl overflow-y-auto bg-surface-raised border border-border"
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
                                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors hover:bg-surface ${
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

                <div className="px-5 pb-4 min-h-[60px]">
                    {tempSelectedBrands.length > 0 ? (
                        <>
                            <p className="text-xs mb-2 text-text-secondary">
                                선택된 브랜드
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {tempSelectedBrands.map((b) => (
                                    <span
                                        key={b.id}
                                        className="flex items-center gap-0.5 text-xs rounded-full bg-accent/15 border border-accent/30 text-accent"
                                    >
                                        <span className="pl-2.5 pr-1 py-0.5 font-medium">
                                            {b.name}
                                        </span>
                                        <button
                                            onClick={() =>
                                                onRemoveTempBrand(b.id)
                                            }
                                            className="pr-2 py-0.5 opacity-60 hover:opacity-100"
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

                <div className="px-5 py-3 flex items-center justify-end gap-2 border-t border-border">
                    {tempSelectedBrands.length > 0 && (
                        <button
                            onClick={onClearTempBrands}
                            className="px-3 py-1.5 rounded-lg text-xs text-text-secondary"
                        >
                            초기화
                        </button>
                    )}
                    <button
                        onClick={onCancel}
                        className="px-4 py-1.5 rounded-lg text-sm bg-surface-raised text-text-secondary border border-border"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-accent hover:bg-accent-hover transition-colors"
                    >
                        완료
                    </button>
                </div>
            </div>
        </div>
    );
}
