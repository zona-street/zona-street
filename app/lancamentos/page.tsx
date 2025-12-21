import { LancamentosTemplate } from "@/components/templates/LancamentosTemplate";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";

export default async function LancamentosPage() {
  let products: Product[] = [];

  try {
    products = await productsApi.getNewDrops();
  } catch (error) {
    console.error("Erro ao buscar lançamentos:", error);
  }

  return <LancamentosTemplate products={products} />;
}
