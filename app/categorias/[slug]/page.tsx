import { CategoriasTemplate } from "@/components/templates/CategoriasTemplate";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";

export default async function CategoriaPage({
  params,
}: {
  params: { slug: string };
}) {
  let products: Product[] = [];

  try {
    products = await productsApi.getAll({
      category: params.slug,
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }

  return <CategoriasTemplate slug={params.slug} products={products} />;
}
