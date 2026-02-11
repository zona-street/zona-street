import { CategoriasTemplate } from "@/components/templates/CategoriasTemplate";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";

// Força dynamic rendering
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let products: Product[] = [];

  try {
    products = await productsApi.getAll({
      category: slug,
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }

  return <CategoriasTemplate slug={slug} products={products} />;
}
