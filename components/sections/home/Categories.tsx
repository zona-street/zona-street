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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold uppercase tracking-tight text-gray-900 md:text-4xl">
          Categorias
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/produtos?categoria=${category.slug}`}
              className="group relative flex h-64 items-end overflow-hidden border border-gray-200 bg-gray-50 p-6 transition-all hover:border-gray-900 hover:shadow-lg"
              style={{
                backgroundImage: `url(${category.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay escuro para melhor legibilidade do texto */}
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/30" />
              <span className="relative z-10 text-xl font-bold uppercase tracking-tight text-white drop-shadow-lg">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
