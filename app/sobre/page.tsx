import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, RefreshCcw, Store } from "lucide-react";

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
            Streetwear e oversized
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
                Nascida em ...
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Aqui vai ficar a história da Zona Street. Fundada por...
              </p>
            </div>

            <div className="border-l-4 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-3 text-2xl font-bold uppercase tracking-tight text-gray-900">
                Estilo Sem Fronteiras
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Cada peça é pensada para quem não aceita padrões....
              </p>
            </div>

            <div className="border-l-4 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-3 text-2xl font-bold uppercase tracking-tight text-gray-900">
                Qualidade & Atitude
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Usamos tecidos premium, estampas exclusivas e acabamentos
                impecáveis...
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
                Qualidade em primeiro lugar
              </h3>
              <p className="text-sm text-gray-300">
                Usamos tecidos premium e acabamentos impecáveis em cada peça.
              </p>
            </div>
            <div className="border-2 border-white p-6 text-center">
              <h3 className="mb-2 text-xl font-bold uppercase">
                Peças exclusivas
              </h3>
              <p className="text-sm text-gray-300">
                Estampas únicas e designs que não passam despercebidos.
              </p>
            </div>
            <div className="border-2 border-white p-6 text-center">
              <h3 className="mb-2 text-xl font-bold uppercase">
                Estilo com identidade
              </h3>
              <p className="text-sm text-gray-300">
                Moda real para pessoas reais que não aceitam padrões.
              </p>
            </div>
          </div>
        </div>

        {/* Como Funciona */}
        <div className="mt-16 border-2 border-gray-900 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-8 text-center text-3xl font-bold uppercase tracking-tight text-gray-900">
            Como Funciona
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border-2 border-gray-900 p-6">
              <h3 className="mb-3 text-lg font-bold uppercase text-gray-900 flex text-center items-center gap-2">
                <Package size={20} /> Entrega para todo o Brasil
              </h3>
              <p className="text-sm text-gray-700">
                Enviamos para qualquer lugar do país com segurança e
                rastreamento.
              </p>
            </div>
            <div className="border-2 border-gray-900 p-6">
              <h3 className="mb-3 text-lg font-bold uppercase text-gray-900 flex text-center items-center gap-2">
                <Store size={20} /> Retirada em Resende
              </h3>
              <p className="text-sm text-gray-700">
                Prefere retirar pessoalmente? Sem problema! Combine conosco.
              </p>
            </div>
            <div className="border-2 border-gray-900 p-6">
              <h3 className="mb-3 text-lg font-bold uppercase text-gray-900 flex text-center items-center gap-2">
                <RefreshCcw size={20} /> Troca imediata
              </h3>
              <p className="text-sm text-gray-700">
                Erro de tamanho? Realizamos troca sem burocracia.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 border-2 border-gray-900 bg-white p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-4 text-3xl font-bold uppercase tracking-tight text-gray-900">
            Vem fazer parte da Zona Street
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
