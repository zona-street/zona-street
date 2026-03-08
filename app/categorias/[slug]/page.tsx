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
  camisas: {
    title: "Camisas Streetwear e Oversized",
    description:
      "Explore nossa coleção de camisas streetwear e oversized. Estilo urbano com qualidade premium. Diversos modelos exclusivos!",
    keywords: [
      "camisas streetwear",
      "camisas oversized",
      "camisas urbanas",
      "camisas estampadas",
    ],
  },
  casacos: {
    title: "Casacos Streetwear",
    description:
      "Casacos streetwear com estilo e conforto. Moletons, corta-ventos e casacos com zíper. Qualidade e exclusividade!",
    keywords: [
      "casacos streetwear",
      "moletons oversized",
      "corta-vento urbano",
      "casacos urbanos",
    ],
  },
  tenis: {
    title: "Tênis Streetwear",
    description:
      "Tênis streetwear para completar seu look urbano. Conforto e estilo em cada par. Confira nossa coleção!",
    keywords: [
      "tênis streetwear",
      "tênis urbanos",
      "sneakers streetwear",
      "calçados urbanos",
    ],
  },
  bones: {
    title: "Bonés Streetwear",
    description:
      "Bonés streetwear para finalizar seu visual. Aba curva, aba reta e five panel. Estilo e atitude!",
    keywords: [
      "bonés streetwear",
      "boné aba curva",
      "boné aba reta",
      "bonés urbanos",
    ],
  },
  bermudas: {
    title: "Bermudas Streetwear",
    description:
      "Bermudas streetwear para o seu estilo urbano. Dri fit, sarja e cargo. Conforto e estilo garantidos!",
    keywords: [
      "bermudas streetwear",
      "bermuda cargo",
      "bermuda dri-fit",
      "bermudas urbanas",
    ],
  },
  calcas: {
    title: "Calças Streetwear",
    description:
      "Calças streetwear para completar seu look urbano. Jogger, baggy e dri fit. Confira nossa coleção!",
    keywords: [
      "calças streetwear",
      "calças urbanas",
      "calça jogger",
      "calça baggy",
    ],
  },
  // Legacy category mappings for backward compatibility
  camisetas: {
    title: "Camisetas Streetwear e Oversized",
    description:
      "Explore nossa coleção de camisetas streetwear e oversized. Estilo urbano com qualidade premium.",
    keywords: ["camisetas streetwear", "camisetas oversized"],
  },
  moletons: {
    title: "Moletons Streetwear e Oversized",
    description:
      "Moletons streetwear com estilo e conforto. Peças oversized perfeitas para o seu visual urbano.",
    keywords: ["moletons streetwear", "moletons oversized"],
  },
  acessorios: {
    title: "Acessórios Streetwear",
    description: "Acessórios streetwear para complementar seu estilo.",
    keywords: ["acessórios streetwear", "bonés streetwear"],
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
