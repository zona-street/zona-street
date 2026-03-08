"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="mx-auto flex-grow-2 max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 border-b-2 border-gray-900 pb-8">
          <div className="mb-4 inline-flex items-center gap-2 border-2 border-orange-600 bg-orange-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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

        {/* Banner promocional */}
        <div className="mb-8 border-2 border-gray-900 bg-gray-900 p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-medium uppercase tracking-wide text-white">
            10% OFF no PIX + Parcelamento em até 10x sem juros
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8 space-y-4">
          {/* Busca */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar lançamentos..."
              className="w-full border-2 border-gray-900 bg-white px-4 py-3 text-base font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 font-bold text-lg"
              >
                ×
              </button>
            )}
          </div>

          {/* Filtro de tamanhos */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold uppercase text-gray-500 mr-1">
              Tamanho:
            </span>
            {PRODUCT_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`border-2 px-3 py-1.5 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors active:scale-95 ${
                  selectedSizes.includes(size)
                    ? "border-orange-street bg-orange-street text-white"
                    : "border-gray-900 bg-white text-gray-900 hover:bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
            {selectedSizes.length > 0 && (
              <button
                onClick={() => setSelectedSizes([])}
                className="text-xs font-bold uppercase text-gray-500 hover:text-gray-900 ml-1"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 border-2 border-gray-300" />
                <div className="mt-4 h-4 bg-gray-200" />
                <div className="mt-2 h-4 bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="border-2 border-gray-900 bg-white p-16 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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

        {/* Products Grid */}
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
      </main>

      <Footer />
    </div>
  );
}
