"use client";

import { useRef, useState } from "react";

import type { BrandSuggestion } from "@/entities/item/model";

export function useBrandFilter() {
  const [selectedBrands, setSelectedBrands] = useState<BrandSuggestion[]>([]);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [modalBrandInput, setModalBrandInput] = useState("");
  const [modalBrandSuggestions, setModalBrandSuggestions] = useState<
    BrandSuggestion[]
  >([]);
  const [tempSelectedBrands, setTempSelectedBrands] = useState<
    BrandSuggestion[]
  >([]);
  const brandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleModalBrandInput(value: string) {
    setModalBrandInput(value);
    if (brandTimerRef.current) clearTimeout(brandTimerRef.current);
    if (!value.trim()) {
      setModalBrandSuggestions([]);
      return;
    }
    brandTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/mercari/brands?q=${encodeURIComponent(value)}`,
        );
        if (res.ok) {
          const { brands } = await res.json();
          setModalBrandSuggestions(brands ?? []);
        }
      } catch {
        // ignore
      }
    }, 300);
  }

  function openBrandModal(currentBrands: BrandSuggestion[]) {
    setTempSelectedBrands([...currentBrands]);
    setModalBrandInput("");
    setModalBrandSuggestions([]);
    setShowBrandModal(true);
  }

  function closeBrandModal() {
    setShowBrandModal(false);
  }

  function addTempBrand(brand: BrandSuggestion) {
    setTempSelectedBrands((prev) =>
      prev.some((b) => b.id === brand.id) ? prev : [...prev, brand],
    );
  }

  function removeTempBrand(id: number) {
    setTempSelectedBrands((prev) => prev.filter((b) => b.id !== id));
  }

  function clearTempBrands() {
    setTempSelectedBrands([]);
  }

  /** Confirm and return the selected brands */
  function confirmBrands(): BrandSuggestion[] {
    const brands = tempSelectedBrands;
    setSelectedBrands(brands);
    setShowBrandModal(false);
    return brands;
  }

  return {
    selectedBrands,
    setSelectedBrands,
    showBrandModal,
    modalBrandInput,
    modalBrandSuggestions,
    tempSelectedBrands,
    openBrandModal,
    closeBrandModal,
    handleModalBrandInput,
    addTempBrand,
    removeTempBrand,
    clearTempBrands,
    confirmBrands,
  };
}
