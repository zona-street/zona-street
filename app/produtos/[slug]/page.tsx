import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import { productsApi } from "@/lib/api/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function ProdutoDetalhePage({
  params,
}: {
  params: { slug: string };
}) {
  let product = null;
  let relatedProducts = [];

  try {
    product = await productsApi.getBySlug(params.slug);
    if (!product) {
      notFound();
    }

    // Buscar produtos relacionados
    relatedProducts = await productsApi.getAll({
      category: product.category,
    });
    relatedProducts = relatedProducts
      .filter((p: any) => p.slug !== product.slug)
      .slice(0, 4);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    notFound();
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Produto */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          {/* Imagens */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden border-2 border-gray-200 bg-white">
              <Image
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.isNewDrop && (
                <Badge className="absolute left-4 top-4 bg-gray-900 text-white">
                  NOVO
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="absolute right-4 top-4 bg-red-600 text-white">
                  -{discount}%
                </Badge>
              )}
            </div>
          </div>

          {/* Informações */}
          <div>
            <h1 className="mb-2 text-4xl font-bold uppercase tracking-tight text-gray-900">
              {product.name}
            </h1>
            <div className="mb-6 flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                R$ {product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through">
                  R$ {product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="mb-6 text-gray-700">{product.description}</p>

            <div className="mb-6">
              <h3 className="mb-2 text-sm font-bold uppercase text-gray-900">
                Tamanhos disponíveis
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size: string) => (
                  <button
                    key={size}
                    className="border-2 border-gray-300 bg-white px-4 py-2 font-bold transition-colors hover:border-gray-900"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Estoque: {product.stock} unidades disponíveis
              </p>
            </div>

            <Button
              className="w-full border-2 border-gray-900 bg-gray-900 py-6 text-sm font-bold uppercase tracking-wide hover:bg-transparent hover:text-gray-900"
              size="lg"
            >
              Adicionar ao Carrinho
            </Button>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-900">
                Informações do Produto
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Envio para todo o Brasil</li>
                <li>• 10% OFF no pagamento via PIX</li>
                <li>• Parcelamento em até 10x sem juros</li>
                <li>• Troca grátis em até 30 dias</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-gray-200 pt-16">
            <h2 className="mb-8 text-3xl font-bold uppercase tracking-tight text-gray-900">
              Produtos Relacionados
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct: any) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  price={relatedProduct.price}
                  oldPrice={relatedProduct.oldPrice}
                  image={relatedProduct.images?.[0] || "/placeholder.jpg"}
                  category={relatedProduct.category}
                  slug={relatedProduct.slug}
                  isNewDrop={relatedProduct.isNewDrop}
                  sizes={relatedProduct.sizes}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
