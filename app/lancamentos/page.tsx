import { LancamentosTemplate } from "@/components/templates/LancamentosTemplate";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";

// Revalidar a cada 1 hora
export const revalidate = 3600;
// Força dynamic rendering se fetch falhar
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function LancamentosPage() {
  let products: Product[] = [];

  try {
    products = await productsApi.getNewDrops();
  } catch (error) {
    console.error("Erro ao buscar lançamentos:", error);
  }

  return <LancamentosTemplate products={products} />;
}
