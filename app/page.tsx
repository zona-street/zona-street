import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/sections/home/Hero";
import { Promotions } from "@/components/sections/home/Promotions";
import { Categories } from "@/components/sections/home/Categories";
import { FeaturedProduct } from "@/components/sections/home/FeaturedProduct";
import { NewDrops } from "@/components/sections/home/NewDrops";
import { Sale } from "@/components/sections/home/Sale";
import { Newsletter } from "@/components/sections/home/Newsletter";

export default function Home() {
  // Mock de produtos para exemplo
  // TODO: No futuro, buscar dados da API Fastify aqui
  const featuredProduct = {
    id: "1",
    name: "Moletom Oversized Número 4",
    price: 249.9,
    oldPrice: 349.9,
    image: "/products/moletom-numero-4.png",
    category: "Moletons",
    slug: "moletom-oversized-numero-4",
  };

  const products = [
    {
      id: "2",
      name: "Camiseta Streetwear Y2K",
      price: 129.9,
      oldPrice: 179.9,
      image: "/products/camiseta-y2k.png",
      category: "Camisetas",
      isNewDrop: true,
      slug: "camiseta-streetwear-y2k",
    },
    {
      id: "3",
      name: "Calça Cargo Oversized",
      price: 299.9,
      image: "/products/calca-cargo.png",
      category: "Calças",
      isNewDrop: true,
      slug: "calca-cargo-oversized",
    },
    {
      id: "4",
      name: "Jaqueta Bomber Zona Street",
      price: 399.9,
      oldPrice: 549.9,
      image: "/products/jaqueta-bomber.png",
      category: "Jaquetas",
      slug: "jaqueta-bomber-zona-street",
    },
    {
      id: "5",
      name: "Camiseta Oversized Básica",
      price: 99.9,
      image: "/products/camiseta-oversized.png",
      category: "Camisetas",
      slug: "camiseta-oversized-basica",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Hero />
        <Promotions />
        <Categories />
        <FeaturedProduct product={featuredProduct} />
        <NewDrops products={products} />
        <Sale />
        <Newsletter />
        <Footer />
      </main>
    </div>
  );
}
