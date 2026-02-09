import { FaInstagram } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black py-10 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/">
              <Image
                src="/logo-branca.png"
                alt="Zona Street Logo"
                width={500}
                height={500}
                className="mb-4 h-auto w-25 cursor-pointer transition-opacity hover:opacity-80"
              />
            </Link>
            <p className="text-sm font-medium text-gray-400">
              Sua loja online em moda streetwear e oversized
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-bold">CATEGORIAS</h4>
            <ul className="space-y-2 text-sm font-medium text-gray-400">
              <li>
                <Link
                  href="/categorias/camisetas"
                  className="hover:text-orange-street transition-colors"
                >
                  Camisetas
                </Link>
              </li>
              <li>
                <Link
                  href="/categorias/moletons"
                  className="hover:text-orange-street transition-colors"
                >
                  Moletons
                </Link>
              </li>
              <li>
                <Link
                  href="/categorias/calcas"
                  className="hover:text-orange-street transition-colors"
                >
                  Calças
                </Link>
              </li>
              <li>
                <Link
                  href="/categorias/acessorios"
                  className="hover:text-orange-street transition-colors"
                >
                  Acessórios
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold">AJUDA</h4>
            <ul className="space-y-2 text-sm font-medium text-gray-400">
              <li>
                <span className="cursor-not-allowed opacity-60">
                  Trocas e Devoluções
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-60">Entregas</span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-60">
                  Tabela de Medidas
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-60">Contato</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold">REDES SOCIAIS</h4>
            <ul className="space-y-2 text-sm font-medium text-gray-400">
              <li>
                <a
                  href="https://instagram.com/zonastreet01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-street text-center transition-colors"
                >
                  <FaInstagram className="inline mr-1" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t-2 border-gray-800 pt-8 text-center text-sm font-medium text-gray-400">
          <p>© 2025 Zona Street. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
