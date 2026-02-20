import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/sections/home/Hero";
import { Promotions } from "@/components/sections/home/Promotions";
import { Categories } from "@/components/sections/home/Categories";
import { FeaturedProduct } from "@/components/sections/home/FeaturedProduct";
import { NewDrops } from "@/components/sections/home/NewDrops";
import { Sale } from "@/components/sections/home/Sale";
import { Newsletter } from "@/components/sections/home/Newsletter";

interface HomeTemplateProps {
  featuredProduct: {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    category: string;
    slug: string;
    sizes?: string[];
    stock?: number;
  } | null;
  newDropProducts: Array<{
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    category: string;
    isNewDrop?: boolean;
    slug: string;
    sizes?: string[];
  }>;
}

export function HomeTemplate({
  featuredProduct,
  newDropProducts,
}: HomeTemplateProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="grow">
        <Hero />
        <Promotions />
        <Categories />
        {featuredProduct && <FeaturedProduct product={featuredProduct} />}
        <NewDrops products={newDropProducts} />
        <Sale />
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
