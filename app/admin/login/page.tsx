"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/store/useAuth";
import { authApi } from "@/lib/api/auth";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica no front-end
    if (!email.trim()) {
      toast.error("Email obrigatório", {
        description: "Por favor, insira seu endereço de email.",
      });
      return;
    }

    if (!password.trim()) {
      toast.error("Senha obrigatória", {
        description: "Por favor, insira sua senha.",
      });
      return;
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email inválido", {
        description: "Por favor, insira um endereço de email válido.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });

      if (response.data.user.role !== "admin") {
        toast.error("Acesso negado", {
          description: "Você não tem permissão para acessar o painel admin.",
        });
        return;
      }

      login(response.data.user, response.data.token);

      toast.success("Login realizado!", {
        description: `Bem-vindo, ${response.data.user.email}`,
      });

      router.push("/admin");
    } catch (error: any) {
      console.error("Erro no login:", error);

      // Trata diferentes tipos de erro
      let errorTitle = "Erro ao fazer login";
      let errorDescription = "Verifique suas credenciais e tente novamente.";

      if (error?.message) {
        // Erros específicos do backend
        if (error.message.includes("Email ou senha incorretos")) {
          errorTitle = "Credenciais inválidas";
          errorDescription =
            "Email ou senha incorretos. Verifique e tente novamente.";
        } else if (error.message.includes("Email inválido")) {
          errorTitle = "Email inválido";
          errorDescription = "Por favor, insira um endereço de email válido.";
        } else if (error.message.includes("Senha é obrigatória")) {
          errorTitle = "Senha obrigatória";
          errorDescription = "Por favor, insira sua senha.";
        } else if (error.message.includes("Dados inválidos")) {
          errorTitle = "Dados inválidos";
          errorDescription = "Verifique se o email e senha estão corretos.";
        } else if (
          error.message.includes("rede") ||
          error.message.includes("fetch")
        ) {
          errorTitle = "Erro de conexão";
          errorDescription =
            "Verifique sua conexão com a internet e tente novamente.";
        } else {
          // Outros erros específicos
          errorDescription = error.message;
        }
      } else if (error?.response) {
        // Erros HTTP específicos
        const status = error.response.status;
        if (status === 401) {
          errorTitle = "Não autorizado";
          errorDescription = "Credenciais inválidas ou conta desativada.";
        } else if (status === 429) {
          errorTitle = "Muitas tentativas";
          errorDescription =
            "Aguarde alguns minutos antes de tentar novamente.";
        } else if (status >= 500) {
          errorTitle = "Erro do servidor";
          errorDescription =
            "Problema temporário. Tente novamente em alguns minutos.";
        }
      }

      toast.error(errorTitle, {
        description: errorDescription,
        duration: 5000, // Mostra por mais tempo para erros
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
      <Card className="w-full max-w-md border-2 border-gray-900 bg-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-6 sm:mb-8 text-center">
          <div className="mb-3 sm:mb-4 flex justify-center">
            <Image
              src="/logo.png"
              alt="Zona Street"
              width={200}
              height={80}
              className="h-auto w-36 sm:w-48"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900">
            Painel Admin
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-600">
            Faça login para acessar o dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-900"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-gray-900 bg-white focus:border-orange-street h-11 sm:h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-900"
            >
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-2 border-gray-900 bg-white focus:border-orange-street h-11 sm:h-12 text-base"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full border-2 border-gray-900 bg-gray-900 py-5 sm:py-6 text-sm sm:text-base font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-orange-street hover:border-orange-street hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-0 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="text-center">
            <Link
              href="/admin/forgot-password"
              className="text-sm font-bold text-gray-600 hover:text-orange-street transition-colors underline"
            >
              Esqueci minha senha
            </Link>
          </div>
        </form>

        {process.env.NODE_ENV !== "production" && (
          <div className="mt-6 border-t-2 border-gray-200 pt-6 text-center">
            <p className="text-xs font-medium text-gray-500">
              Ambiente de desenvolvimento
              <br />
              <span className="font-bold text-gray-900"></span>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
