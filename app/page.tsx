import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zona Street - Moda Streetwear e Oversized | Loja Online",
  description:
    "A melhor loja de moda streetwear e oversized do Brasil. Camisas, casacos, tênis, bonés, bermudas e calças urbanas. 10% OFF no PIX, parcelamento em 10x e entrega para todo Brasil!",
  keywords: [
    "loja streetwear",
    "comprar streetwear online",
    "moda streetwear brasil",
    "roupas oversized",
    "street style brasil",
    "moda urbana online",
    "camisas streetwear",
    "casacos streetwear",
    "tênis streetwear",
    "bonés streetwear",
    "bermudas streetwear",
    "calças streetwear",
    "zona street resende",
    "loja streetwear resende rj",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Zona Street - Moda Streetwear e Oversized",
    description:
      "A melhor loja de moda streetwear e oversized do Brasil. 10% OFF no PIX e entrega para todo Brasil!",
    type: "website",
    url: "https://zonastreet.com.br",
    images: [
      {
        url: "/new-logo.png",
        width: 1200,
        height: 630,
        alt: "Zona Street - Moda Streetwear e Oversized",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zona Street - Moda Streetwear e Oversized",
    description:
      "A melhor loja de moda streetwear e oversized do Brasil. 10% OFF no PIX e entrega para todo Brasil!",
    images: ["/new-logo.png"],
  },
};

// Revalidar a cada 1 hora
export const revalidate = 3600;
// Força dynamic rendering se fetch falhar
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  // Buscar dados reais da API (Server Component com ISR)
  let featuredProducts: Product[] = [];
  let newDropProducts: Product[] = [];

  try {
    // Buscar produtos em destaque e novos lançamentos em paralelo
    const results = await Promise.allSettled([
      productsApi.getFeatured(),
      productsApi.getNewDrops(),
    ]);

    if (results[0].status === "fulfilled") {
      featuredProducts = results[0].value || [];
    }
    if (results[1].status === "fulfilled") {
      newDropProducts = results[1].value || [];
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    // Continuar com arrays vazios
  }

  // Pegar o primeiro produto em destaque (com verificação)
  const featuredProduct =
    Array.isArray(featuredProducts) && featuredProducts.length > 0
      ? featuredProducts[0]
      : null;

  // Transformar produtos para o formato esperado pelos componentes
  const formattedNewDrops = newDropProducts.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    oldPrice: product.oldPrice,
    image: product.images?.[0] || "/placeholder.jpg",
    category: product.category,
    isNewDrop: product.isNewDrop,
    slug: product.slug,
    sizes: product.sizes,
  }));

  const formattedFeaturedProduct = featuredProduct
    ? {
        id: featuredProduct.id,
        name: featuredProduct.name,
        price: featuredProduct.price,
        oldPrice: featuredProduct.oldPrice,
        image: featuredProduct.images?.[0] || "/placeholder.jpg",
        category: featuredProduct.category,
        slug: featuredProduct.slug,
        sizes: featuredProduct.sizes,
        stock: featuredProduct.stock,
      }
    : null;

  return (
    <HomeTemplate
      featuredProduct={formattedFeaturedProduct}
      newDropProducts={formattedNewDrops}
    />
  );
}
