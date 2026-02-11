import { ProductDetailsTemplate } from "@/components/templates/ProductDetailsTemplate";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";
import { notFound } from "next/navigation";

// Força dynamic rendering
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function ProdutoDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: Product | null = null;
  let relatedProducts: Product[] = [];

  try {
    product = await productsApi.getBySlug(slug);

    if (!product) {
      notFound();
    }

    // Buscar produtos relacionados
    const related = await productsApi.getAll({
      category: product.category,
    });
    relatedProducts = related
      .filter((p) => p.slug !== product!.slug)
      .slice(0, 4);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    notFound();
  }

  return (
    <ProductDetailsTemplate
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
