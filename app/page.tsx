import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/sections/home/Hero";
import { Promotions } from "@/components/sections/home/Promotions";
import { Categories } from "@/components/sections/home/Categories";
import { FeaturedProduct } from "@/components/sections/home/FeaturedProduct";
import { NewDrops } from "@/components/sections/home/NewDrops";
import { Sale } from "@/components/sections/home/Sale";
import { Newsletter } from "@/components/sections/home/Newsletter";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/lib/types/product";

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
      }
    : null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Hero />
        <Promotions />
        <Categories />
        {formattedFeaturedProduct && (
          <FeaturedProduct product={formattedFeaturedProduct} />
        )}
        <NewDrops products={formattedNewDrops} />
        <Sale />
        <Newsletter />
        <Footer />
      </main>
    </div>
  );
}
