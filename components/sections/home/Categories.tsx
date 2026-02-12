import Link from "next/link";

export function Categories() {
  const categories = [
    {
      name: "Camisetas",
      slug: "camisetas",
      image: "/camisetas.webp",
    },
    { name: "Moletons", slug: "moletons", image: "/moletons.webp" },
    { name: "Calças", slug: "calcas", image: "/calças.jpg" },
    {
      name: "Acessórios",
      slug: "acessorios",
      image: "/acessórios.webp",
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 sm:mb-12 text-center text-2xl sm:text-3xl font-bold uppercase tracking-tight text-gray-900 md:text-4xl">
          Categorias
        </h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categorias/${category.slug}`}
              className="group relative flex h-48 sm:h-56 md:h-64 items-end overflow-hidden border-2 border-gray-900 bg-gray-50 p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none active:scale-[0.98]"
              style={{
                backgroundImage: `url(${category.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay escuro para melhor legibilidade do texto */}
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/30" />
              <span className="relative z-10 text-base sm:text-lg md:text-xl font-bold uppercase tracking-tight text-white drop-shadow-lg">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
