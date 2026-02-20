import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Entregas | Zona Street",
  description: "Informações sobre prazos e formas de entrega da Zona Street.",
};

export default function EntregasPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 min-h-[60vh]">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8">Entregas</h1>

        <div className="prose prose-neutral max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold mb-2">Área de entrega</h2>
            <p>
              Enviamos para <strong>todo o Brasil</strong> via Correios e
              transportadoras parceiras.
            </p>
            <p>
              Para pedidos em <strong>Resende e região</strong>, o frete é{" "}
              <strong>grátis</strong>!
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">Prazos estimados</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Resende e região: 1 a 2 dias úteis</li>
              <li>Sul e Sudeste: 3 a 7 dias úteis</li>
              <li>Centro-Oeste e Norte/Nordeste: 7 a 15 dias úteis</li>
            </ul>
            <p className="text-sm text-gray-500 mt-2">
              Os prazos são contados a partir da confirmação do pagamento e
              podem variar conforme a transportadora e localidade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">Rastreamento</h2>
            <p>
              Após o envio do pedido, você receberá o código de rastreamento
              pelo e-mail cadastrado. Use o código no site dos Correios ou da
              transportadora para acompanhar sua entrega.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">Frete</h2>
            <p>
              O valor do frete é calculado automaticamente no carrinho com base
              no CEP informado. Para Resende e região, o frete é gratuito.
            </p>
          </section>

          <p className="text-sm text-gray-500">
            Dúvidas sobre sua entrega? Entre em contato pelo WhatsApp ou
            Instagram.
          </p>
          <a
            href="https://wa.me/5524992060913"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white font-bold px-5 py-2.5 rounded hover:opacity-80 transition-opacity"
          >
            Falar no WhatsApp
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
