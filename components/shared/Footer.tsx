import { FaInstagram } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { SettingsIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black py-6 sm:py-10 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/">
              <Image
                src="/logo-branca.png"
                alt="Zona Street Logo"
                width={500}
                height={500}
                className="mb-3 h-auto w-28 sm:w-32 md:w-36 cursor-pointer transition-opacity hover:opacity-80"
              />
            </Link>
            <p className="text-sm font-medium text-gray-400 leading-relaxed">
              Sua loja online em moda streetwear e oversized
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-bold text-base">CATEGORIAS</h4>
            <ul className="space-y-2 text-sm font-medium text-gray-400">
              <li>
                <Link
                  href="/categorias/camisetas"
                  className="hover:text-orange-street transition-colors inline-block py-0.5"
                >
                  Camisetas
                </Link>
              </li>
              <li>
                <Link
                  href="/categorias/moletons"
                  className="hover:text-orange-street transition-colors inline-block py-0.5"
                >
                  Moletons
                </Link>
              </li>
              <li>
                <Link
                  href="/categorias/calcas"
                  className="hover:text-orange-street transition-colors inline-block py-0.5"
                >
                  Calças
                </Link>
              </li>
              <li>
                <Link
                  href="/categorias/acessorios"
                  className="hover:text-orange-street transition-colors inline-block py-0.5"
                >
                  Acessórios
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-bold text-base">AJUDA</h4>
            <ul className="space-y-2 text-sm font-medium text-gray-400">
              <li>
                <span className="cursor-not-allowed opacity-60 inline-block py-0.5">
                  Trocas e Devoluções
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-60 inline-block py-0.5">
                  Entregas
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-60 inline-block py-0.5">
                  Tabela de Medidas
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-60 inline-block py-0.5">
                  Contato
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-bold text-base">REDES SOCIAIS</h4>
            <ul className="space-y-2 text-sm font-medium text-gray-400">
              <li>
                <a
                  href="https://instagram.com/zonastreet01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-street transition-colors inline-flex items-center py-0.5"
                >
                  <FaInstagram className="inline mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 border-t-2 border-gray-800 pt-4 sm:pt-6 text-center text-sm font-medium text-gray-400">
          <p className="mb-2">
            © 2025 Zona Street. Todos os direitos reservados.
          </p>
          <Link
            href="/admin"
            className="text-xs text-gray-600 hover:text-gray-500 transition-colors opacity-50 hover:opacity-75"
          >
            <SettingsIcon className="inline-block mr-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
