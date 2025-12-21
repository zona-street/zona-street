import Link from "next/link";

export function Sale() {
  return (
    <section className="bg-gray-900 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="mb-6 inline-block border border-white px-6 py-2 text-xs font-medium uppercase tracking-wider">
            Promoção Relâmpago
          </span>
          <h2 className="mb-6 text-5xl font-black uppercase tracking-tight md:text-7xl">
            Até 50% OFF
          </h2>
          <p className="mb-10 text-lg font-medium text-gray-300">
            Em peças selecionadas + Frete Grátis
          </p>
          <Link
            href="/produtos"
            className="inline-block border-2 border-white bg-white px-12 py-4 text-sm font-bold uppercase tracking-wide text-gray-900 transition-colors hover:bg-transparent hover:text-white"
          >
            Aproveitar Agora
          </Link>
        </div>
      </div>
    </section>
  );
}
