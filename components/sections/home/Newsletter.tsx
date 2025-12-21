"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar");
      }

      toast.success("Cadastro realizado!", {
        description: "Você receberá em primeira mão nossos novos lançamentos!",
      });

      setEmail("");
    } catch (error) {
      toast.error("Erro ao cadastrar", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="border-y border-gray-200 bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo-cinza.png"
            alt="Zona Street"
            width={500}
            height={500}
            className="h-auto w-48"
          />
        </div>
        <span className="mb-6 inline-block border border-gray-900 bg-gray-900 px-6 py-2 text-sm font-bold uppercase tracking-wider text-white">
          Newsletter Zona Street
        </span>
        <h2 className="mb-4 text-4xl font-black uppercase text-gray-900 md:text-6xl">
          Novos Drops
        </h2>
        <p className="mb-8 text-lg font-medium text-gray-600 md:text-xl">
          Receba notificações sobre nossos lançamentos
        </p>
        <div className="mb-10 grid gap-4 text-left sm:grid-cols-3">
          <div className="border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-900">
              Novos Produtos
            </h3>
            <p className="text-sm font-medium text-gray-600">
              Seja o primeiro a saber
            </p>
          </div>
          <div className="border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-900">
              Lançamentos
            </h3>
            <p className="text-sm font-medium text-gray-600">
              Acesso exclusivo às novidades
            </p>
          </div>
          <div className="border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-900">
              Coleções
            </h3>
            <p className="text-sm font-medium text-gray-600">
              Novidades direto no seu email
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <input
            type="email"
            placeholder="Digite seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="border border-gray-300 bg-white px-8 py-4 text-base font-medium text-gray-900 focus:border-gray-900 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="border-2 border-gray-900 bg-gray-900 px-10 py-4 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-orange-street hover:border-orange-street disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-500">
          Seus dados estão seguros conosco
        </p>
      </div>
    </section>
  );
}
