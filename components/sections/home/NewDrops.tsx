import Link from "next/link";
import { ProductCard } from "@/components/shared/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  isNewDrop?: boolean;
  slug: string;
  sizes?: string[];
}

interface NewDropsProps {
  products: Product[];
}

export function NewDrops({ products }: NewDropsProps) {
  // Verificar se products existe e é um array
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-gray-900 md:text-4xl">
            Novos Drops
          </h2>
          <Link
            href="/lancamentos"
            className="border-2 border-gray-900 bg-transparent px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-wide text-gray-900 transition-colors hover:bg-gray-900 hover:text-white active:scale-[0.98]"
          >
            Ver Todos
          </Link>
        </div>
        <div className="mb-6 sm:mb-8 border border-gray-900 bg-gray-900 p-3 sm:p-4 text-center">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-white">
            10% OFF no PIX + Parcelamento em até 10x sem juros
          </p>
        </div>

        {safeProducts.length === 0 ? (
          <div className="border-2 border-gray-200 bg-gray-50 p-8 sm:p-12 text-center">
            <p className="text-base sm:text-lg font-bold uppercase text-gray-500">
              Em breve novos produtos
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Cadastre-se na newsletter para ser avisado!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
            {safeProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
