import { ProductDetailsTemplate } from "@/components/templates/ProductDetailsTemplate";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";
import { notFound } from "next/navigation";

export default async function ProdutoDetalhePage({
  params,
}: {
  params: { slug: string };
}) {
  let product: Product | null = null;
  let relatedProducts: Product[] = [];

  try {
    product = await productsApi.getBySlug(params.slug);
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
