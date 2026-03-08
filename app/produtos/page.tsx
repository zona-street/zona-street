import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";
import { Metadata } from "next";
import { ProdutosTemplate } from "@/components/templates/ProdutosTemplate";

export const metadata: Metadata = {
  title: "Produtos Streetwear e Oversized",
  description:
    "Explore todos os produtos da Zona Street: camisas, casacos, tênis, bonés, bermudas e calças streetwear. Estilo urbano com qualidade e exclusividade.",
  openGraph: {
    title: "Produtos - Zona Street",
    description:
      "Explore todos os produtos streetwear da Zona Street. Camisas, casacos, tênis e muito mais!",
  },
};

// Força dynamic rendering
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

  // Buscar produtos da API (server-side para initial render / SEO)
  let products: Product[] = [];
  try {
    products = await productsApi.getAll(
      categoria ? { category: categoria } : {},
    );
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }

  return <ProdutosTemplate products={products} initialCategory={categoria} />;
}
