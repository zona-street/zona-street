"use client";

import { useEffect, useState, useCallback } from "react";
import { PageLayout } from "@/components/shared/PageLayout";
import { ProductCard } from "@/components/shared/ProductCard";
import { SearchInput } from "@/components/shared/SearchInput";
import { FilterChip } from "@/components/shared/FilterChip";
import { SizeFilter } from "@/components/shared/SizeFilter";
import { ProductGridSkeleton } from "@/components/shared/ProductGridSkeleton";
import { Product } from "@/lib/types/product";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
  SUBCATEGORIES,
  CATEGORY_LABELS,
  type ProductCategory,
} from "@/lib/constants/product";
import { productsApi } from "@/lib/api/products";

interface ProdutosTemplateProps {
  products: Product[];
  initialCategory?: string;
}

export function ProdutosTemplate({
  products: initialProducts,
  initialCategory,
}: ProdutosTemplateProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory ?? null,
  );
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null,
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [displayedProducts, setDisplayedProducts] =
    useState<Product[]>(initialProducts);
  const [isFiltering, setIsFiltering] = useState(false);

  const subcategoryOptions = activeCategory
    ? (SUBCATEGORIES[activeCategory as ProductCategory] ?? [])
    : [];

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    activeCategory !== null ||
    activeSubcategory !== null ||
    selectedSizes.length > 0;

  const fetchFiltered = useCallback(async () => {
    setIsFiltering(true);
    try {
      const results = await productsApi.getAll({
        category: activeCategory ?? undefined,
        subcategory: activeSubcategory ?? undefined,
        search: searchQuery.trim() || undefined,
        sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
      });
      setDisplayedProducts(results);
    } catch {
      setDisplayedProducts([]);
    } finally {
      setIsFiltering(false);
    }
  }, [activeCategory, activeSubcategory, searchQuery, selectedSizes]);

  useEffect(() => {
    if (!hasActiveFilters) {
      setDisplayedProducts(initialProducts);
      return;
    }
    const timer = setTimeout(fetchFiltered, 300);
    return () => clearTimeout(timer);
  }, [hasActiveFilters, fetchFiltered, initialProducts]);

  function handleCategoryChange(category: string | null) {
    setActiveCategory(category);
    setActiveSubcategory(null);
  }

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }

  function clearAllFilters() {
    setSearchQuery("");
    setActiveCategory(null);
    setActiveSubcategory(null);
    setSelectedSizes([]);
  }

  const loading = isFiltering;
  const products = displayedProducts;

  const title = activeCategory
    ? CATEGORY_LABELS[activeCategory as ProductCategory] || activeCategory
    : "Todos os Produtos";

  return (
    <PageLayout mainClassName="py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold uppercase tracking-tight text-gray-900 md:text-5xl">
          {title}
        </h1>
        <p className="mt-2 text-gray-600">
          {loading
            ? "Carregando..."
            : `${products.length} ${products.length === 1 ? "produto encontrado" : "produtos encontrados"}`}
        </p>
      </div>

      <div className="mb-10 space-y-4">
        <SearchInput
          id="produtos-search"
          name="search"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar produtos..."
          ariaLabel="Buscar produtos"
        />

        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={activeCategory === null}
            onClick={() => handleCategoryChange(null)}
          >
            Todos
          </FilterChip>
          {PRODUCT_CATEGORIES.map((cat) => (
            <FilterChip
              key={cat}
              active={activeCategory === cat}
              activeVariant="orange"
              onClick={() =>
                handleCategoryChange(activeCategory === cat ? null : cat)
              }
            >
              {CATEGORY_LABELS[cat]}
            </FilterChip>
          ))}
        </div>

        {subcategoryOptions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={activeSubcategory === null}
              onClick={() => setActiveSubcategory(null)}
            >
              Todos
            </FilterChip>
            {subcategoryOptions.map((sub) => (
              <FilterChip
                key={sub.value}
                active={activeSubcategory === sub.value}
                activeVariant="orange"
                onClick={() =>
                  setActiveSubcategory(
                    activeSubcategory === sub.value ? null : sub.value,
                  )
                }
              >
                {sub.label}
              </FilterChip>
            ))}
          </div>
        )}

        <SizeFilter
          sizes={PRODUCT_SIZES}
          selectedSizes={selectedSizes}
          onToggle={toggleSize}
          onClear={() => setSelectedSizes([])}
        />

        {hasActiveFilters && (
          <div>
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold uppercase text-gray-500 hover:text-gray-900 border-b border-gray-400 hover:border-gray-900"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>

      {loading && (
        <ProductGridSkeleton grid="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
      )}

      {!loading && products.length === 0 ? (
        <div className="border-2 border-gray-200 bg-white p-16 text-center">
          <p className="text-xl font-bold uppercase text-gray-500">
            Nenhum produto encontrado
          </p>
          <p className="mt-2 text-sm text-gray-400">
            {hasActiveFilters
              ? "Tente outros filtros ou limpe a busca."
              : "Tente outra categoria ou volte em breve!"}
          </p>
        </div>
      ) : (
        !loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                oldPrice={product.oldPrice}
                image={product.images?.[0] || "/placeholder.jpg"}
                category={product.category}
                slug={product.slug}
                isNewDrop={product.isNewDrop}
                sizes={product.sizes}
              />
            ))}
          </div>
        )
      )}
    </PageLayout>
  );
}
