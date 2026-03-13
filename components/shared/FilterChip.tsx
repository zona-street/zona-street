"use client";

import { cn } from "@/lib/utils";

interface FilterChipProps {
  active: boolean;
  activeVariant?: "dark" | "orange";
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function FilterChip({
  active,
  activeVariant = "dark",
  onClick,
  children,
  className,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow-brutal-sm transition-colors active:scale-95",
        active
          ? activeVariant === "orange"
            ? "border-orange-street bg-orange-street text-white"
            : "border-gray-900 bg-gray-900 text-white"
          : "border-gray-900 bg-white text-gray-900 hover:bg-gray-100",
        className,
      )}
    >
      {children}
    </button>
  );
}
