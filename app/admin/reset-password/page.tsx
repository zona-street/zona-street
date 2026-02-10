"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import Image from "next/image";

function ResetPasswordContent() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Token inválido", {
        description: "O link de redefinição está incompleto ou inválido",
      });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token não encontrado");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não correspondem");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      setResetSuccess(true);
      toast.success("Senha redefinida!", {
        description: response.message,
      });

      // Redireciona para o login após 3 segundos
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
    } catch (error) {
      toast.error("Erro ao redefinir senha", {
        description:
          error instanceof Error
            ? error.message
            : "Verifique se o link ainda é válido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md border-2 border-red-600 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-center">
            <h1 className="text-2xl font-black uppercase text-red-600">
              ⚠️ Token Inválido
            </h1>
            <p className="mt-4 text-sm text-gray-600">
              O link de redefinição está incompleto ou inválido.
            </p>
            <Link href="/admin/forgot-password" className="mt-6 block">
              <Button className="w-full border-2 border-gray-900 bg-gray-900 font-bold uppercase text-white hover:bg-orange-street hover:border-orange-street">
                Solicitar Novo Link
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

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
            Nova Senha
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-600">
            Crie uma nova senha para sua conta
          </p>
        </div>

        {!resetSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm font-bold uppercase tracking-wide text-gray-900"
              >
                Nova Senha
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="border-2 border-gray-900 bg-white focus:border-orange-street"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-bold uppercase tracking-wide text-gray-900"
              >
                Confirmar Nova Senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="border-2 border-gray-900 bg-white focus:border-orange-street"
              />
            </div>

            <div className="rounded-lg border-2 border-orange-600 bg-orange-50 p-3 text-xs text-orange-900">
              <strong>⚠️ Lembre-se:</strong> Este link expira em 15 minutos e só
              pode ser usado uma vez.
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full border-2 border-gray-900 bg-gray-900 py-6 text-base font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-orange-street hover:border-orange-street hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-0 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Redefinindo..." : "Redefinir Senha"}
            </Button>

            <div className="text-center">
              <Link
                href="/admin/login"
                className="text-sm font-bold text-gray-600 hover:text-orange-street transition-colors underline"
              >
                Voltar para o login
              </Link>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg border-2 border-green-600 bg-green-50 p-4 text-center">
              <div className="mb-2 text-4xl">✓</div>
              <p className="text-lg font-black uppercase text-green-900">
                Senha Redefinida!
              </p>
              <p className="mt-2 text-sm text-green-800">
                Sua senha foi alterada com sucesso.
              </p>
              <p className="mt-3 text-xs text-green-700">
                Redirecionando para o login...
              </p>
            </div>

            <Link href="/admin/login">
              <Button className="w-full border-2 border-gray-900 bg-gray-900 font-bold uppercase text-white hover:bg-orange-street hover:border-orange-street">
                Ir para o Login
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-900 border-t-transparent mx-auto" />
            <p className="mt-4 text-sm font-bold text-gray-600">
              Carregando...
            </p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
