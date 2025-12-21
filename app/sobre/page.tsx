import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16 border-b-2 border-gray-900 pb-12">
          <div className="mb-6 inline-flex items-center gap-2 border-2 border-gray-900 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Nossa História
          </div>
          <h1 className="mb-4 text-5xl font-bold uppercase tracking-tight text-gray-900 md:text-6xl">
            Zona Street
          </h1>
          <p className="text-xl font-medium text-gray-600">
            Streetwear oversized com a atitude do bairro
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden border-2 border-gray-900 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Image
              src="/logo-cinza-sem-n4.png"
              alt="Zona Street - Logo"
              fill
              className="object-contain p-8"
            />
          </div>

          {/* Story */}
          <div className="space-y-6">
            <div className="border-l-4 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-3 text-2xl font-bold uppercase tracking-tight text-gray-900">
                Nascida nas Ruas
              </h2>
              <p className="text-gray-700 leading-relaxed">
                A Zona Street surgiu em 2024 com uma missão clara: trazer o
                autêntico estilo streetwear oversized para quem respira a
                cultura urbana. Inspirados pela energia das ruas, pela música
                que embala os becos e pela atitude que transforma o concreto em
                passarela.
              </p>
            </div>

            <div className="border-l-4 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-3 text-2xl font-bold uppercase tracking-tight text-gray-900">
                Estilo Sem Fronteiras
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Cada peça é pensada para quem não aceita padrões. Oversized não
                é apenas um corte, é uma filosofia: liberdade de movimento,
                conforto absoluto e um visual marcante que grita personalidade.
                Do trap ao skateboard, da arte urbana ao basquete, unimos as
                tribos da Zona.
              </p>
            </div>

            <div className="border-l-4 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-3 text-2xl font-bold uppercase tracking-tight text-gray-900">
                Qualidade & Atitude
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Usamos tecidos premium, estampas exclusivas e acabamentos
                impecáveis. Cada moletom, camiseta ou acessório carrega a
                essência da Zona: resistência, conforto e um design que não
                passa despercebido. Aqui, qualidade e atitude andam juntas.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-16 border-2 border-gray-900 bg-gray-900 p-8 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-8 text-center text-3xl font-bold uppercase tracking-tight">
            Nossos Valores
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border-2 border-white p-6 text-center">
              <h3 className="mb-2 text-xl font-bold uppercase">
                Autenticidade
              </h3>
              <p className="text-sm text-gray-300">
                Sem mimimi, sem frescura. Moda real para pessoas reais.
              </p>
            </div>
            <div className="border-2 border-white p-6 text-center">
              <h3 className="mb-2 text-xl font-bold uppercase">Comunidade</h3>
              <p className="text-sm text-gray-300">
                A Zona é de todos. Valorizamos cada pessoa que veste nossa
                marca.
              </p>
            </div>
            <div className="border-2 border-white p-6 text-center">
              <h3 className="mb-2 text-xl font-bold uppercase">Inovação</h3>
              <p className="text-sm text-gray-300">
                Sempre atentos às tendências, mas nunca esquecendo das raízes.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 border-2 border-gray-900 bg-white p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-4 text-3xl font-bold uppercase tracking-tight text-gray-900">
            Vem fazer parte da Zona
          </h2>
          <p className="mb-8 text-gray-600">
            Explore nossa coleção e encontre o look que combina com você
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              className="border-2 border-gray-900 bg-gray-900 px-8 py-6 text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
            >
              <Link href="/produtos">Ver Produtos</Link>
            </Button>
            <Button
              asChild
              className="border-2 border-gray-900 bg-transparent px-8 py-6 text-sm font-bold uppercase tracking-wide text-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
            >
              <Link href="/lancamentos">Ver Lançamentos</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
