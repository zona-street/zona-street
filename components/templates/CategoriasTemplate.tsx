"use client";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import { Product } from "@/lib/types/product";
import type { ProductCategory } from "@/lib/constants/product";

const categoryNames: Record<ProductCategory, string> = {
  camisetas: "Camisetas",
  moletons: "Moletons",
  calcas: "Calças",
  jaquetas: "Jaquetas",
  acessorios: "Acessórios",
};

interface CategoriasTemplateProps {
  slug: string;
  products: Product[];
  loading?: boolean;
}

export function CategoriasTemplate({
  slug,
  products,
  loading = false,
}: CategoriasTemplateProps) {
  const categoryName = slug
    ? categoryNames[slug as ProductCategory] ||
      slug.charAt(0).toUpperCase() + slug.slice(1)
    : "Categoria";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 border-b-2 border-gray-900 pb-8">
          <h1 className="mb-2 text-4xl font-bold uppercase tracking-tight text-gray-900 md:text-5xl">
            {categoryName}
          </h1>
          <p className="text-lg text-gray-600">
            {loading
              ? "Carregando..."
              : products.length + " produtos encontrados"}
          </p>
        </div>

        {/* Banner Promocional */}
        <div className="mb-8 border-2 border-gray-900 bg-gray-900 p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-medium uppercase tracking-wide text-white">
            10% OFF no PIX + Parcelamento em até 10x sem juros
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="mt-4 h-4 bg-gray-200" />
                <div className="mt-2 h-4 bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="border-2 border-gray-900 bg-white p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="mb-2 text-xl font-bold uppercase text-gray-900">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600">
              Estamos preparando novidades incríveis para esta categoria!
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
