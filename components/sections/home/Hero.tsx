import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 border border-gray-900 shadow-md bg-gray-50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-900">
            Nova Coleção disponível
          </div>
          <div className="mb-0 flex items-center justify-center">
            <Image
              src="/wallabee-bordado.png"
              alt="Wallabee Bordado - Identidade Zona Street"
              width={550}
              height={454}
              className="h-24 w-auto md:h-32"
            />
          </div>
          <Image
            src="/logo-cinza-sem-n4.png"
            alt="Modelo usando roupas da Zona Street em um cenário urbano"
            width={500}
            height={400}
            className="mx-auto  h-auto w-70 max-w-3xl mb-10 "
          />

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/lancamentos"
              className="border-2 border-gray-900 bg-gray-900 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-transparent hover:text-gray-900"
            >
              Ver Lançamentos
            </Link>
            <Link
              href="/produtos"
              className="border-2 border-gray-300 bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-wide text-gray-900 transition-colors hover:border-gray-900"
            >
              Explorar Tudo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
