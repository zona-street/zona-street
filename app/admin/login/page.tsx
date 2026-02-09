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
    } catch (error) {
      toast.error("Erro ao fazer login", {
        description:
          error instanceof Error ? error.message : "Verifique suas credenciais",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md border-2 border-gray-900 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/logo.png"
              alt="Zona Street"
              width={200}
              height={80}
              className="h-auto w-48"
            />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">
            Painel Admin
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-600">
            Faça login para acessar o dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-bold uppercase tracking-wide text-gray-900"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="andrediniz@id.uff.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-gray-900 bg-white focus:border-orange-street"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-bold uppercase tracking-wide text-gray-900"
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
              className="border-2 border-gray-900 bg-white focus:border-orange-street"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full border-2 border-gray-900 bg-gray-900 py-6 text-base font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-orange-street hover:border-orange-street hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-0 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <span className="font-bold text-gray-900">
                andrediniz@id.uff.br
              </span>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
