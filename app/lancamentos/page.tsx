import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import { productsApi } from "@/lib/api/products";

export default async function LancamentosPage() {
  // Buscar novos lançamentos da API
  let products = [];
  try {
    products = await productsApi.getNewDrops();
  } catch (error) {
    console.error("Erro ao buscar lançamentos:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 border border-gray-900 bg-gray-50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-900 shadow-md">
            Novos Lançamentos
          </div>
          <h1 className="text-4xl font-bold uppercase tracking-tight text-gray-900 md:text-5xl">
            Drops da Semana
          </h1>
          <p className="mt-2 text-gray-600">
            Confira as últimas novidades da Zona Street
          </p>
        </div>

        {/* Banner promocional */}
        <div className="mb-10 border border-gray-900 bg-gray-900 p-6 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-white">
            10% OFF no PIX + Parcelamento em até 10x sem juros
          </p>
        </div>

        {/* Produtos */}
        {products.length === 0 ? (
          <div className="border-2 border-gray-200 bg-white p-16 text-center">
            <p className="text-xl font-bold uppercase text-gray-500">
              Em breve novos lançamentos
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Cadastre-se na newsletter para ser avisado!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: any) => (
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
