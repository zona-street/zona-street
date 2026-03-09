import { LancamentosTemplate } from "@/components/templates/LancamentosTemplate";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lançamentos Streetwear | New Drops",
  description:
    "Confira os últimos lançamentos da Zona Street! Novidades em moda streetwear e oversized — camisas, casacos, tênis, bonés e muito mais. Seja o primeiro a garantir as peças mais exclusivas!",
  keywords: [
    "lançamentos streetwear",
    "new drops streetwear",
    "novidades moda urbana",
    "drops zona street",
    "camisas novas streetwear",
    "casacos novos oversized",
    "lançamentos 2025",
  ],
  alternates: {
    canonical: "/lancamentos",
  },
  openGraph: {
    title: "Lançamentos - Zona Street",
    description:
      "Confira os últimos lançamentos em moda streetwear. Novidades exclusivas na Zona Street!",
    url: "https://zonastreet.com.br/lancamentos",
    images: [
      {
        url: "/new-logo.png",
        width: 1200,
        height: 630,
        alt: "Lançamentos Zona Street",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lançamentos - Zona Street",
    description:
      "Confira os últimos lançamentos em moda streetwear. Novidades exclusivas!",
    images: ["/new-logo.png"],
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
