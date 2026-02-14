import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative bg-white py-12 sm:py-16 md:py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 border border-gray-900 shadow-md bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium uppercase tracking-wider text-gray-900">
            Nova Coleção disponível
          </div>
          <div className="mb-0 flex items-center justify-center">
            <Image
              src="/wallabee.png"
              alt="Wallabee - Identidade Zona Street"
              width={550}
              height={454}
              className="h-28 w-auto sm:h-20 md:h-24 lg:h-32 -mb-4 sm:mb-0"
            />
          </div>
          <Image
            src="/zona-street-graffiti.png"
            alt="Modelo usando roupas da Zona Street em um cenário urbano"
            width={1109}
            height={768}
            className="mx-auto h-auto w-70 sm:w-80 max-w-3xl mb-6 sm:mb-10"
          />

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/lancamentos"
              className="w-full sm:w-auto border-2 border-gray-900 bg-gray-900 px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-transparent hover:text-gray-900 active:scale-[0.98]"
            >
              Ver Lançamentos
            </Link>
            <Link
              href="/produtos"
              className="w-full sm:w-auto border-2 border-gray-300 bg-transparent px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-bold uppercase tracking-wide text-gray-900 transition-colors hover:border-gray-900 active:scale-[0.98]"
            >
              Explorar Tudo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
