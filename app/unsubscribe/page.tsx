import { Suspense } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import UnsubscribeForm from "./UnsubscribeForm";

export const metadata = {
  title: "Cancelar Inscrição | Zona Street",
  description: "Cancelar sua inscrição na newsletter da Zona Street.",
};

export default function UnsubscribePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 min-h-[60vh]">
        <Suspense fallback={<LoadingState />}>
          <UnsubscribeForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function LoadingState() {
  return (
    <div className="border-2 border-gray-900 bg-white p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 uppercase">
        Carregando...
      </h1>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-900 border-t-orange-street mx-auto mb-4"></div>
      <p className="text-gray-600">Processando sua solicitação...</p>
    </div>
  );
}
