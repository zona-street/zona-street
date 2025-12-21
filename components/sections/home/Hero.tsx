export function Hero() {
  return (
    <section className="relative bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 border border-gray-300 bg-gray-50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-900">
            Nova Coleção Verão 2025
          </div>
          <h1 className="mb-6 text-6xl font-black uppercase leading-none tracking-tight text-gray-900 md:text-8xl">
            Zona Street
          </h1>
          <p className="mb-10 text-lg font-medium text-gray-600 md:text-xl">
            Streetwear Oversized com Atitude
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="border-2 border-gray-900 bg-gray-900 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-transparent hover:text-gray-900">
              Ver Lançamentos
            </button>
            <button className="border-2 border-gray-300 bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-wide text-gray-900 transition-colors hover:border-gray-900">
              Explorar Tudo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
