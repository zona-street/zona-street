"use client";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/lib/types/product";

interface LancamentosTemplateProps {
  products: Product[];
  loading?: boolean;
}

export function LancamentosTemplate({
  products,
  loading = false,
}: LancamentosTemplateProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="mx-auto flex-grow max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 border-b-2 border-gray-900 pb-8">
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
        <div className="mb-10 border-2 border-gray-900 bg-gray-900 p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-medium uppercase tracking-wide text-white">
            10% OFF no PIX + Parcelamento em até 10x sem juros
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="relative">
            <Carousel opts={{ slidesToScroll: 1 }}>
              <CarouselContent>
                <CarouselItem>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-square bg-gray-200 border-2 border-gray-300" />
                        <div className="mt-4 h-4 bg-gray-200" />
                        <div className="mt-2 h-4 bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="border-2 border-gray-900 bg-white p-16 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-bold uppercase text-gray-900">
              Em breve, novos lançamentos
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Cadastre-se na newsletter para ser avisado!
            </p>
          </div>
        )}

        {/* Products Carousel */}
        {!loading && products.length > 0 && (
          <div className="relative">
            <Carousel opts={{ slidesToScroll: 1 }}>
              <CarouselContent>
                {products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="basis-full sm:basis-1/2 lg:basis-1/4"
                  >
                    <div className="grid gap-6 grid-cols-1">
                      <ProductCard
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
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
