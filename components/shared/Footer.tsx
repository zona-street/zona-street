import { FaInstagram } from "react-icons/fa";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-black py-10 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Image
              src="/logo-branca.png"
              alt="Zona Street Logo"
              width={500}
              height={500}
              className="mb-4 h-auto w-25"
            />
            <p className="text-sm font-medium text-gray-400">
              Streetwear oversized com a atitude do bairro.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-bold">CATEGORIAS</h4>
            <ul className="space-y-2 text-sm font-medium text-gray-400">
              <li>
                <a href="#" className="hover:text-orange-street">
                  Camisetas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-street">
                  Moletons
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-street">
                  Calças
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-street">
                  Acessórios
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold">AJUDA</h4>
            <ul className="space-y-2 text-sm font-medium text-gray-400">
              <li>
                <a href="#" className="hover:text-orange-street">
                  Trocas e Devoluções
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-street">
                  Entregas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-street">
                  Tabela de Medidas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-street">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold">REDES SOCIAIS</h4>
            <ul className="space-y-2 text-sm font-medium text-gray-400">
              <li>
                <a href="#" className="hover:text-orange-street text-center ">
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
