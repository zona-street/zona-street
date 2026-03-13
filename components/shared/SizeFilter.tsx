"use client";

import { FilterChip } from "./FilterChip";

interface SizeFilterProps {
  sizes: readonly string[];
  selectedSizes: readonly string[];
  onToggle: (size: string) => void;
  onClear: () => void;
}

export function SizeFilter({
  sizes,
  selectedSizes,
  onToggle,
  onClear,
}: SizeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs font-bold uppercase text-gray-500 mr-1">
        Tamanho:
      </span>
      {sizes.map((size) => (
        <FilterChip
          key={size}
          active={selectedSizes.includes(size)}
          activeVariant="orange"
          compact
          onClick={() => onToggle(size)}
        >
          {size}
        </FilterChip>
      ))}
      {selectedSizes.length > 0 && (
        <button
          onClick={onClear}
          className="text-xs font-bold uppercase text-gray-500 hover:text-gray-900 ml-1"
        >
          Limpar
        </button>
      )}
    </div>
  );
}
