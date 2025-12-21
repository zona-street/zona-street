import Link from "next/link";

export function Categories() {
  const categories = [
    { name: "Camisetas", slug: "camisetas" },
    { name: "Moletons", slug: "moletons" },
    { name: "Calças", slug: "calcas" },
    { name: "Acessórios", slug: "acessorios" },
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
              className="group relative flex h-64 items-end overflow-hidden border border-gray-200 bg-gray-50 p-6 transition-colors hover:border-gray-900"
            >
              <span className="text-xl font-bold uppercase tracking-tight text-gray-900">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
