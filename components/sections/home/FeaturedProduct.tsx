import { ProductCardFeatured } from "@/components/shared/ProductCard";

interface FeaturedProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    category: string;
    slug: string;
    sizes?: string[];
    stock?: number;
  } | null;
}

export function FeaturedProduct({ product }: FeaturedProductProps) {
  // Verificar se o produto existe
  if (!product) {
    return null;
  }

  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <section className="border-y border-gray-200 bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-gray-900 md:text-4xl">
              Lançamento Exclusivo
            </h2>
            {product.stock !== undefined && product.stock > 0 && (
            <p className="mt-2 text-sm font-medium text-gray-600">
              Edição Limitada - Apenas {product.stock} unidades
            </p>
          )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <span className="border border-orange-600 bg-orange-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-wide text-white">
              Exclusivo
            </span>
            {discountPercentage > 0 && (
              <span className="border border-gray-900 bg-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-wide text-white">
                -{discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>
        <div className="mx-auto max-w-xl">
          <ProductCardFeatured {...product} />
        </div>
      </div>
    </section>
  );
}
