import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Trocas e Devoluções | Zona Street",
  description:
    "Saiba como funciona nossa política de trocas e devoluções na Zona Street.",
};

export default function TrocasPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 min-h-[60vh]">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8">
          Trocas e Devoluções
        </h1>

        <div className="prose prose-neutral max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold mb-2">Prazo para troca</h2>
            <p>
              Aceitamos trocas em até <strong>30 dias corridos</strong> a partir
              da data de entrega do pedido. O produto deve estar sem uso, com
              etiqueta original e na embalagem.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">Como solicitar uma troca</h2>
            <p>
              Entre em contato conosco pelo WhatsApp informando seu número de
              pedido e o motivo da troca. Nossa equipe irá orientar você sobre
              os próximos passos.
            </p>
            <a
              href="https://wa.me/5524992060913"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 bg-black text-white font-bold px-5 py-2.5 rounded hover:opacity-80 transition-opacity"
            >
              Falar no WhatsApp
            </a>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">Devoluções</h2>
            <p>
              Caso o produto apresente defeito de fabricação ou tenha sido
              enviado incorretamente, realizamos a devolução com reembolso
              integral. Entre em contato conosco imediatamente ao receber o
              produto.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">Condições gerais</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Produtos com sinais de uso não serão aceitos para troca.</li>
              <li>
                A etiqueta original deve estar intacta e afixada na peça.
              </li>
              <li>
                O custo de envio para troca pode ser de responsabilidade do
                cliente, exceto em casos de defeito ou erro nosso.
              </li>
            </ul>
          </section>

          <p className="text-sm text-gray-500">
            Em caso de dúvidas, entre em contato pelo WhatsApp ou Instagram.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
