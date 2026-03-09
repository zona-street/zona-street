import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";
import { Metadata } from "next";
import { ProdutosTemplate } from "@/components/templates/ProdutosTemplate";

export const metadata: Metadata = {
  title: "Todos os Produtos Streetwear e Oversized",
  description:
    "Explore toda a coleção da Zona Street: camisas, casacos, tênis, bonés, bermudas e calças streetwear. Estilo urbano com qualidade e exclusividade. 10% OFF no PIX!",
  keywords: [
    "produtos streetwear",
    "camisas streetwear",
    "casacos streetwear",
    "tênis streetwear",
    "bonés streetwear",
    "bermudas streetwear",
    "calças streetwear",
    "roupas oversized",
    "moda urbana online",
    "comprar streetwear",
  ],
  alternates: {
    canonical: "/produtos",
  },
  openGraph: {
    title: "Todos os Produtos - Zona Street",
    description:
      "Explore toda a coleção streetwear da Zona Street. Camisas, casacos, tênis, bonés, bermudas e calças!",
    url: "https://zonastreet.com.br/produtos",
    images: [
      {
        url: "/new-logo.png",
        width: 1200,
        height: 630,
        alt: "Produtos Zona Street",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Todos os Produtos - Zona Street",
    description:
      "Explore toda a coleção streetwear da Zona Street. Camisas, casacos, tênis e muito mais!",
    images: ["/new-logo.png"],
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
