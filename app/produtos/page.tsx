import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos Streetwear e Oversized",
  description:
    "Explore todos os produtos da Zona Street: camisetas, moletons, calças e acessórios streetwear. Estilo urbano com qualidade e exclusividade.",
  openGraph: {
    title: "Produtos - Zona Street",
    description:
      "Explore todos os produtos streetwear da Zona Street. Camisetas, moletons, calças e muito mais!",
  },
};

// Revalidar a cada 1 minuto
export const revalidate = 60;
// Força dynamic rendering se fetch falhar
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface SearchParams {
  categoria?: string;
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const categoria = params.categoria;

  // Buscar produtos da API
  let products: Product[] = [];
  try {
    products = await productsApi.getAll(
      categoria ? { category: categoria } : {},
    );
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }

  // Tradução de categorias
  const categoriaNome = categoria
    ? {
        camisetas: "Camisetas",
        moletons: "Moletons",
        calcas: "Calças",
        jaquetas: "Jaquetas",
        acessorios: "Acessórios",
      }[categoria] || "Produtos"
    : "Todos os Produtos";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="mx-auto flex-grow max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-gray-900 md:text-5xl">
            {categoriaNome}
          </h1>
          <p className="mt-2 text-gray-600">
            {products.length}{" "}
            {products.length === 1
              ? "produto encontrado"
              : "produtos encontrados"}
          </p>
        </div>

        {/* Produtos */}
        {products.length === 0 ? (
          <div className="border-2 border-gray-200 bg-white p-16 text-center">
            <p className="text-xl font-bold uppercase text-gray-500">
              Nenhum produto encontrado
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Tente outra categoria ou volte em breve!
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
