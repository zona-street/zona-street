import { ProductDetailsTemplate } from "@/components/templates/ProductDetailsTemplate";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Força dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let product: Product | null = null;

  try {
    product = await productsApi.getBySlug(slug);
  } catch (error) {
    console.error("Erro ao buscar produto para metadata:", error);
  }

  if (!product) {
    return {
      title: "Produto não encontrado",
    };
  }

  const productImage = product.images?.[0] || "/placeholder.jpg";

  return {
    title: `${product.name} - ${product.category}`,
    description:
      product.description ||
      `Compre ${product.name} na Zona Street. Moda streetwear e oversized com qualidade e estilo único. Confira!`,
    keywords: [
      product.name,
      product.category,
      "streetwear",
      "oversized",
      "zona street",
    ],
    openGraph: {
      title: `${product.name} - Zona Street`,
      description:
        product.description || `Compre ${product.name} na Zona Street`,
      images: [
        {
          url: productImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - Zona Street`,
      description:
        product.description || `Compre ${product.name} na Zona Street`,
      images: [productImage],
    },
  };
}

export default async function ProdutoDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: Product | null = null;
  let relatedProducts: Product[] = [];

  try {
    product = await productsApi.getBySlug(slug);

    if (!product) {
      notFound();
    }

    // Buscar produtos relacionados
    const related = await productsApi.getAll({
      category: product.category,
    });
    relatedProducts = related
      .filter((p) => p.slug !== product!.slug)
      .slice(0, 4);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    notFound();
  }

  return (
    <ProductDetailsTemplate
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
