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
      "Compre camisas streetwear e oversized na Zona Street. Modelos oversized, primeira linha, camisa de time e dri fit. Estilo urbano com qualidade premium. 10% OFF no PIX!",
    keywords: [
      "camisas streetwear",
      "camisas oversized",
      "camisa oversized básica",
      "camisa primeira linha",
      "camisa de time streetwear",
      "camisa dri fit",
      "camisas urbanas",
    ],
  },
  casacos: {
    title: "Casacos Streetwear | Moletons e Corta-Vento",
    description:
      "Casacos streetwear com estilo e conforto na Zona Street. Moletons, corta-ventos e casacos com zíper oversized. Qualidade e exclusividade. 10% OFF no PIX!",
    keywords: [
      "casacos streetwear",
      "moletom streetwear",
      "moletons oversized",
      "corta-vento urbano",
      "casaco zíper streetwear",
      "casacos urbanos",
    ],
  },
  tenis: {
    title: "Tênis Streetwear",
    description:
      "Tênis streetwear para completar seu look urbano na Zona Street. Conforto e estilo em cada par. Confira nossa coleção exclusiva de calçados!",
    keywords: [
      "tênis streetwear",
      "sneakers streetwear",
      "tênis urbanos",
      "calçados urbanos",
      "tênis estilo urbano",
    ],
  },
  bones: {
    title: "Bonés Streetwear | Aba Curva, Aba Reta e Five Panel",
    description:
      "Bonés streetwear para finalizar seu visual na Zona Street. Modelos aba curva, aba reta e five panel. Estilo, atitude e qualidade garantidos!",
    keywords: [
      "bonés streetwear",
      "boné aba curva",
      "boné aba reta",
      "five panel streetwear",
      "bonés urbanos",
    ],
  },
  bermudas: {
    title: "Bermudas Streetwear | Dri Fit, Sarja e Cargo",
    description:
      "Bermudas streetwear na Zona Street. Modelos dri fit, sarja e cargo para o seu estilo urbano. Conforto e estilo garantidos. 10% OFF no PIX!",
    keywords: [
      "bermudas streetwear",
      "bermuda cargo",
      "bermuda dri-fit",
      "bermuda sarja",
      "bermudas urbanas",
    ],
  },
  calcas: {
    title: "Calças Streetwear | Jogger, Baggy e Dri Fit",
    description:
      "Calças streetwear para completar seu look urbano na Zona Street. Modelos jogger, baggy e dri fit. Conforto e estilo em cada peça. 10% OFF no PIX!",
    keywords: [
      "calças streetwear",
      "calça jogger",
      "calça baggy",
      "calças urbanas",
      "calça dri-fit streetwear",
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
    description:
      "Acessórios streetwear para complementar seu estilo urbano na Zona Street.",
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
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: `Explore produtos de ${slug} na Zona Street. Moda streetwear e oversized com qualidade e estilo único.`,
    keywords: [slug, "streetwear", "zona street"],
  };

  return {
    title: info.title,
    description: info.description,
    keywords: info.keywords,
    alternates: {
      canonical: `/categorias/${slug}`,
    },
    openGraph: {
      title: `${info.title} - Zona Street`,
      description: info.description,
      url: `https://zonastreet.com.br/categorias/${slug}`,
      images: [
        {
          url: "/new-logo.png",
          width: 1200,
          height: 630,
          alt: `${info.title} - Zona Street`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${info.title} - Zona Street`,
      description: info.description,
      images: ["/new-logo.png"],
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
