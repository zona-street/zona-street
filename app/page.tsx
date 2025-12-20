import { Navbar } from "@/components/Navbar";
import { ProductCard, ProductCardFeatured } from "@/components/ProductCard";

export default function Home() {
  // Mock de produtos para exemplo
  const featuredProduct = {
    id: "1",
    name: "Moletom Oversized Número 4",
    price: 249.90,
    oldPrice: 349.90,
    image: "/products/moletom-numero-4.png",
    category: "Moletons",
    slug: "moletom-oversized-numero-4",
  };

  const products = [
    {
      id: "2",
      name: "Camiseta Streetwear Y2K",
      price: 129.90,
      oldPrice: 179.90,
      image: "/products/camiseta-y2k.png",
      category: "Camisetas",
      isNewDrop: true,
      slug: "camiseta-streetwear-y2k",
    },
    {
      id: "3",
      name: "Calça Cargo Oversized",
      price: 299.90,
      image: "/products/calca-cargo.png",
      category: "Calças",
      isNewDrop: true,
      slug: "calca-cargo-oversized",
    },
    {
      id: "4",
      name: "Jaqueta Bomber Zona Street",
      price: 399.90,
      oldPrice: 549.90,
      image: "/products/jaqueta-bomber.png",
      category: "Jaquetas",
      slug: "jaqueta-bomber-zona-street",
    },
    {
      id: "5",
      name: "Camiseta Oversized Básica",
      price: 99.90,
      image: "/products/camiseta-oversized.png",
      category: "Camisetas",
      slug: "camiseta-oversized-basica",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="border-b-3 border-black bg-gradient-to-br from-orange-street to-orange-street/80 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* TODO: Substituir por logo/imagem hero */}
              {/* Placeholder: Imagem hero principal (substituir por /public/hero-banner.png) */}
              <h1 className="mb-6 text-5xl font-black leading-tight drop-shadow-lg md:text-7xl">
                ZONA STREET
              </h1>
              <p className="mb-8 text-xl font-bold md:text-2xl">
                Streetwear Oversized com Atitude 🔥
              </p>
              <button className="border-3 border-black bg-white px-8 py-4 text-lg font-black text-black shadow-brutal transition-all hover:shadow-brutal-lg hover:-translate-y-1">
                EXPLORAR COLEÇÃO
              </button>
            </div>
          </div>
        </section>

        {/* Featured Product */}
        <section className="border-b-3 border-black bg-off-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-4xl font-black">PRODUTO EM DESTAQUE</h2>
              <span className="rounded-sm border-3 border-black bg-orange-street px-4 py-2 text-sm font-extrabold text-white shadow-brutal-sm">
                EXCLUSIVO
              </span>
            </div>
            <div className="mx-auto max-w-2xl">
              <ProductCardFeatured {...featuredProduct} />
            </div>
          </div>
        </section>

        {/* New Drops Grid */}
        <section className="border-b-3 border-black py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-center gap-3">
              <h2 className="text-4xl font-black">NOVOS DROPS</h2>
              <span className="animate-pulse text-2xl">🔥</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-b-3 border-black bg-blue-street py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-4xl font-black md:text-5xl">
              CADASTRE-SE E GANHE 10% OFF
            </h2>
            <p className="mb-8 text-lg font-bold">
              Na primeira compra + acesso antecipado aos novos drops
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <input
                type="email"
                placeholder="seu@email.com"
                className="border-3 border-black px-6 py-4 font-bold text-black shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-orange-street"
              />
              <button className="border-3 border-black bg-orange-street px-8 py-4 font-black shadow-brutal transition-all hover:shadow-brutal-lg hover:-translate-y-1">
                QUERO DESCONTO
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black py-12 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <h3 className="mb-4 text-lg font-black">ZONA STREET</h3>
                <p className="text-sm font-medium text-gray-400">
                  Streetwear oversized com a atitude do bairro.
                </p>
              </div>
              <div>
                <h4 className="mb-4 font-bold">CATEGORIAS</h4>
                <ul className="space-y-2 text-sm font-medium text-gray-400">
                  <li><a href="#" className="hover:text-orange-street">Camisetas</a></li>
                  <li><a href="#" className="hover:text-orange-street">Moletons</a></li>
                  <li><a href="#" className="hover:text-orange-street">Calças</a></li>
                  <li><a href="#" className="hover:text-orange-street">Acessórios</a></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-bold">AJUDA</h4>
                <ul className="space-y-2 text-sm font-medium text-gray-400">
                  <li><a href="#" className="hover:text-orange-street">Trocas e Devoluções</a></li>
                  <li><a href="#" className="hover:text-orange-street">Entregas</a></li>
                  <li><a href="#" className="hover:text-orange-street">Tabela de Medidas</a></li>
                  <li><a href="#" className="hover:text-orange-street">Contato</a></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-bold">REDES SOCIAIS</h4>
                <ul className="space-y-2 text-sm font-medium text-gray-400">
                  <li><a href="#" className="hover:text-orange-street">Instagram</a></li>
                  <li><a href="#" className="hover:text-orange-street">TikTok</a></li>
                  <li><a href="#" className="hover:text-orange-street">Twitter</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t-2 border-gray-800 pt-8 text-center text-sm font-medium text-gray-400">
              <p>© 2024 Zona Street. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
