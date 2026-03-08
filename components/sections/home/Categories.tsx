import Link from "next/link";

export function Categories() {
  const categories = [
    { name: "Camisas", slug: "camisas", image: "/camisas.webp" },
    { name: "Casacos", slug: "casacos", image: "/casacos.webp" },
    { name: "Tênis", slug: "tenis", image: "/tenis-street.jpg" },
    { name: "Bonés", slug: "bones", image: "/bonés.webp" },
    { name: "Bermudas", slug: "bermudas", image: "/bermuda.webp" },
    { name: "Calças", slug: "calcas", image: "/calças.jpg" },
  ];

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 sm:mb-12 text-center text-2xl sm:text-3xl font-bold uppercase tracking-tight text-gray-900 md:text-4xl">
          Categorias
        </h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categorias/${category.slug}`}
              className="group relative flex h-44 sm:h-46 md:h-48 items-end overflow-hidden border-2 border-gray-900 bg-gray-50 p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none active:scale-[0.98]"
              style={{
                backgroundImage: `url(${category.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay escuro para melhor legibilidade do texto */}
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/30" />
              <span className="relative z-10 text-sm sm:text-base font-bold uppercase tracking-tight text-white drop-shadow-lg">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
