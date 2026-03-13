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
  CATEGORY_LABELS,
  SUBCATEGORIES,
  PRODUCT_SIZES,
  type ProductCategory,
} from "@/lib/constants/product";
import { productsApi } from "@/lib/api/products";

interface CategoriasTemplateProps {
  slug: string;
  products: Product[];
  loading?: boolean;
}

export function CategoriasTemplate({
  slug,
  products: initialProducts,
  loading: initialLoading = false,
}: CategoriasTemplateProps) {
  const categoryName =
    CATEGORY_LABELS[slug as ProductCategory] ||
    slug.charAt(0).toUpperCase() + slug.slice(1);

  const subcategoryOptions = SUBCATEGORIES[slug as ProductCategory] ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null,
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [displayedProducts, setDisplayedProducts] =
    useState<Product[]>(initialProducts);
  const [isFiltering, setIsFiltering] = useState(false);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    activeSubcategory !== null ||
    selectedSizes.length > 0;

  const fetchFiltered = useCallback(async () => {
    setIsFiltering(true);
    try {
      const results = await productsApi.getAll({
        category: slug,
        search: searchQuery.trim() || undefined,
        subcategory: activeSubcategory ?? undefined,
        sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
      });
      setDisplayedProducts(results);
    } catch {
      setDisplayedProducts([]);
    } finally {
      setIsFiltering(false);
    }
  }, [slug, searchQuery, activeSubcategory, selectedSizes]);

  useEffect(() => {
    if (!hasActiveFilters) {
      setDisplayedProducts(initialProducts);
      return;
    }
    const timer = setTimeout(fetchFiltered, 300);
    return () => clearTimeout(timer);
  }, [hasActiveFilters, fetchFiltered, initialProducts]);

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }

  const loading = initialLoading || isFiltering;
  const products = displayedProducts;

  return (
    <PageLayout>
      <div className="mb-8 border-b-2 border-gray-900 pb-8">
        <h1 className="mb-2 text-4xl font-bold uppercase tracking-tight text-gray-900 md:text-5xl">
          {categoryName}
        </h1>
        <p className="text-lg text-gray-600">
          {loading
            ? "Carregando..."
            : products.length + " produtos encontrados"}
        </p>
      </div>

      <div className="mb-8 border-2 border-gray-900 bg-gray-900 p-4 text-center shadow-brutal">
        <p className="text-sm font-medium uppercase tracking-wide text-white">
          10% OFF no PIX + Parcelamento em até 10x sem juros
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <SearchInput
          id="categorias-search"
          name="search"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar produtos..."
          ariaLabel="Buscar produtos"
        />

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
      </div>

      {loading && <ProductGridSkeleton />}

      {!loading && products.length === 0 && (
        <div className="border-2 border-gray-900 bg-white p-12 text-center shadow-brutal">
          <h3 className="mb-2 text-xl font-bold uppercase text-gray-900">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600">
            {hasActiveFilters
              ? "Tente outros filtros ou limpe a busca."
              : "Estamos preparando novidades incríveis para esta categoria!"}
          </p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      )}
    </PageLayout>
  );
}
