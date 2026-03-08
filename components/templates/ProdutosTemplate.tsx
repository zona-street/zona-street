"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
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
    setActiveSubcategory(null); // reset subcategory when category changes
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="mx-auto flex-grow max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Filtros */}
        <div className="mb-10 space-y-4">
          {/* Busca */}
          <div className="relative">
            <input
              id="produtos-search"
              name="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos..."
              autoComplete="off"
              aria-label="Buscar produtos"
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

          {/* Categorias */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`border-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors active:scale-95 ${
                activeCategory === null
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-900 bg-white text-gray-900 hover:bg-gray-100"
              }`}
            >
              Todos
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  handleCategoryChange(activeCategory === cat ? null : cat)
                }
                className={`border-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors active:scale-95 ${
                  activeCategory === cat
                    ? "border-orange-street bg-orange-street text-white"
                    : "border-gray-900 bg-white text-gray-900 hover:bg-gray-100"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Subcategorias (somente quando a categoria selecionada tem subcategorias) */}
          {subcategoryOptions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSubcategory(null)}
                className={`border-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors active:scale-95 ${
                  activeSubcategory === null
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-900 bg-white text-gray-900 hover:bg-gray-100"
                }`}
              >
                Todos
              </button>
              {subcategoryOptions.map((sub) => (
                <button
                  key={sub.value}
                  onClick={() =>
                    setActiveSubcategory(
                      activeSubcategory === sub.value ? null : sub.value,
                    )
                  }
                  className={`border-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors active:scale-95 ${
                    activeSubcategory === sub.value
                      ? "border-orange-street bg-orange-street text-white"
                      : "border-gray-900 bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

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

          {/* Botão de limpar tudo */}
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

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="mt-4 h-4 bg-gray-200" />
                <div className="mt-2 h-4 bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Produtos */}
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
      </main>

      <Footer />
    </div>
  );
}
