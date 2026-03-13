"use client";

import { useEffect, useState, useCallback } from "react";
import { PageLayout } from "@/components/shared/PageLayout";
import { ProductCard } from "@/components/shared/ProductCard";
import { SearchInput } from "@/components/shared/SearchInput";
import { SizeFilter } from "@/components/shared/SizeFilter";
import { ProductGridSkeleton } from "@/components/shared/ProductGridSkeleton";
import { Product } from "@/lib/types/product";
import { PRODUCT_SIZES } from "@/lib/constants/product";
import { productsApi } from "@/lib/api/products";

interface LancamentosTemplateProps {
  products: Product[];
  loading?: boolean;
}

export function LancamentosTemplate({
  products: initialProducts,
  loading: initialLoading = false,
}: LancamentosTemplateProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [displayedProducts, setDisplayedProducts] =
    useState<Product[]>(initialProducts);
  const [isFiltering, setIsFiltering] = useState(false);

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedSizes.length > 0;

  const fetchFiltered = useCallback(async () => {
    setIsFiltering(true);
    try {
      const results = await productsApi.getAll({
        isNewDrop: true,
        search: searchQuery.trim() || undefined,
        sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
      });
      setDisplayedProducts(results);
    } catch {
      setDisplayedProducts([]);
    } finally {
      setIsFiltering(false);
    }
  }, [searchQuery, selectedSizes]);

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
    <PageLayout mainClassName="mx-auto flex-grow-2 max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 border-b-2 border-gray-900 pb-8">
        <div className="mb-4 inline-flex items-center gap-2 border-2 border-orange-600 bg-orange-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-brutal-sm">
          Novos Lançamentos
        </div>
        <h1 className="text-4xl font-bold uppercase tracking-tight text-gray-900 md:text-5xl">
          Drops da Semana
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {loading
            ? "Carregando..."
            : `${products.length} produtos disponíveis`}
        </p>
      </div>

      <div className="mb-8 border-2 border-gray-900 bg-gray-900 p-6 text-center shadow-brutal">
        <p className="text-sm font-medium uppercase tracking-wide text-white">
          10% OFF no PIX + Parcelamento em até 10x sem juros
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <SearchInput
          id="lancamentos-search"
          name="search"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar lançamentos..."
          ariaLabel="Buscar lançamentos"
        />

        <SizeFilter
          sizes={PRODUCT_SIZES}
          selectedSizes={selectedSizes}
          onToggle={toggleSize}
          onClear={() => setSelectedSizes([])}
        />
      </div>

      {loading && <ProductGridSkeleton bordered />}

      {!loading && products.length === 0 && (
        <div className="border-2 border-gray-900 bg-white p-16 text-center shadow-brutal">
          <p className="text-xl font-bold uppercase text-gray-900">
            {hasActiveFilters
              ? "Nenhum lançamento encontrado"
              : "Em breve, novos lançamentos"}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {hasActiveFilters
              ? "Tente outros filtros ou limpe a busca."
              : "Cadastre-se na newsletter para ser avisado!"}
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
