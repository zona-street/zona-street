import { LancamentosTemplate } from "@/components/templates/LancamentosTemplate";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lançamentos Streetwear",
  description:
    "Confira os últimos lançamentos da Zona Street! Novidades em moda streetwear e oversized. Seja o primeiro a ter as peças mais exclusivas!",
  openGraph: {
    title: "Lançamentos - Zona Street",
    description:
      "Confira os últimos lançamentos em moda streetwear. Novidades exclusivas!",
  },
};

// Revalidar a cada 1 hora
export const revalidate = 3600;
// Força dynamic rendering se fetch falhar
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function LancamentosPage() {
  let products: Product[] = [];

  try {
    products = await productsApi.getNewDrops();
  } catch (error) {
    console.error("Erro ao buscar lançamentos:", error);
  }

  return <LancamentosTemplate products={products} />;
}
