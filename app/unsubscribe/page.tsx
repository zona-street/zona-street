"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1";

export default function UnsubscribePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoUnsubscribing, setAutoUnsubscribing] = useState(false);
  const hasAttemptedAuto = useRef(false);

  const performUnsubscribe = useCallback(
    async (emailToUnsubscribe: string) => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${API_URL}/subscribers/${encodeURIComponent(emailToUnsubscribe)}`,
          {
            method: "DELETE",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao desinscrever");
        }

        toast.success("Desinscrito com sucesso!", {
          description: "Você foi removido da nossa newsletter.",
        });

        // Redireciona após 2 segundos
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (error) {
        toast.error("Erro ao desinscrever", {
          description:
            error instanceof Error
              ? error.message
              : "Tente novamente mais tarde",
        });
        setAutoUnsubscribing(false);
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  // Tentativa de unsubscrita automática se houver email na query string
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam && !hasAttemptedAuto.current) {
      setEmail(emailParam);
      setAutoUnsubscribing(true);
      hasAttemptedAuto.current = true;
      performUnsubscribe(emailParam);
    }
  }, [searchParams, performUnsubscribe]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    performUnsubscribe(email);
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 min-h-[60vh]">
        {autoUnsubscribing && isLoading ? (
          <div className="border-2 border-gray-900 bg-white p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 uppercase">
              Processando...
            </h1>
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-900 border-t-orange-street mx-auto mb-4"></div>
            <p className="text-gray-600">Removendo você da newsletter...</p>
          </div>
        ) : (
          <div className="border-2 border-gray-900 bg-white p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 uppercase">
              Cancelar Inscrição
            </h1>

            <p className="text-gray-600 mb-8">
              Sentiremos sua falta! Você será removido da nossa newsletter
              permanentemente.
            </p>

            <form onSubmit={handleUnsubscribe} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold uppercase mb-2 text-gray-900"
                >
                  Email cadastrado
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full border-2 border-gray-900 px-4 py-3 text-base font-medium text-gray-900 placeholder-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full border-2 border-gray-900 bg-gray-900 px-6 py-3 text-base font-bold uppercase tracking-wide text-white transition-all hover:bg-red-600 hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? "Processando..." : "Desinscrever"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Esta ação é permanente. Você não receberá mais notificações
                sobre novos produtos.
              </p>
            </form>

            <div className="mt-12 pt-8 border-t-2 border-gray-200">
              <h2 className="text-lg font-bold uppercase mb-4 text-gray-900">
                Dados & Privacidade
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Nós respeitamos sua privacidade. Seus dados são armazenados com
                segurança em nosso banco de dados e não são compartilhados com
                terceiros.
              </p>
              <p className="text-sm text-gray-600">
                Se tiver dúvidas sobre nossos practices de dados, entre em
                contato conosco pelo WhatsApp.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
