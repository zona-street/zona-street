import { CategoriasTemplate } from "@/components/templates/CategoriasTemplate";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";
import { Metadata } from "next";

// Força dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const categoryInfo: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  camisetas: {
    title: "Camisetas Streetwear e Oversized",
    description:
      "Explore nossa coleção de camisetas streetwear e oversized. Estilo urbano com qualidade premium. Diversos modelos e estampas exclusivas!",
    keywords: [
      "camisetas streetwear",
      "camisetas oversized",
      "camisetas urbanas",
      "camisetas estampadas",
    ],
  },
  moletons: {
    title: "Moletons Streetwear e Oversized",
    description:
      "Moletons streetwear com estilo e conforto. Peças oversized perfeitas para o seu visual urbano. Qualidade e exclusividade!",
    keywords: [
      "moletons streetwear",
      "moletons oversized",
      "moletom urbano",
      "hoodies streetwear",
    ],
  },
  calcas: {
    title: "Calças Streetwear",
    description:
      "Calças streetwear para completar seu look urbano. Conforto e estilo em cada peça. Confira nossa coleção!",
    keywords: [
      "calças streetwear",
      "calças urbanas",
      "calças cargo",
      "pants streetwear",
    ],
  },
  acessorios: {
    title: "Acessórios Streetwear",
    description:
      "Acessórios streetwear para complementar seu estilo. Bonés, bolsas, meias e muito mais. Finalize seu look com atitude!",
    keywords: [
      "acessórios streetwear",
      "bonés streetwear",
      "bolsas urbanas",
      "acessórios urbanos",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const info = categoryInfo[slug] || {
    title: "Categoria",
    description: "Explore produtos desta categoria na Zona Street",
    keywords: [],
  };

  return {
    title: info.title,
    description: info.description,
    keywords: info.keywords,
    openGraph: {
      title: `${info.title} - Zona Street`,
      description: info.description,
    },
  };
}

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
