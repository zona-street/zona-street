"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.forgotPassword(email);

      setEmailSent(true);
      toast.success("Email enviado!", {
        description: response.message,
      });
    } catch (error) {
      // Mesmo em erro, mostramos mensagem genérica por segurança
      setEmailSent(true);
      toast.info("Verificação enviada", {
        description:
          "Se o email existir, você receberá instruções para redefinir sua senha",
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
            Esqueci Minha Senha
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-600">
            Insira seu email para receber instruções
          </p>
        </div>

        {!emailSent ? (
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full border-2 border-gray-900 bg-gray-900 py-6 text-base font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-orange-street hover:border-orange-street hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-0 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Enviando..." : "Enviar Instruções"}
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
            <div className="rounded-lg border-2 border-green-600 bg-green-50 p-4">
              <p className="text-sm font-bold text-green-900">
                ✓ Verificação enviada!
              </p>
              <p className="mt-2 text-sm text-green-800">
                Se o email <strong>{email}</strong> estiver cadastrado, você
                receberá instruções para redefinir sua senha em alguns minutos.
              </p>
              <p className="mt-3 text-xs text-green-700">
                <strong>Importante:</strong> O link expira em 15 minutos.
              </p>
            </div>

            <div className="space-y-2 text-center text-sm text-gray-600">
              <p>Não recebeu o email?</p>
              <ul className="space-y-1 text-xs">
                <li>• Verifique sua pasta de spam</li>
                <li>• Aguarde alguns minutos</li>
                <li>• Tente novamente se necessário</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                variant="outline"
                className="flex-1 border-2 border-gray-900 bg-white font-bold uppercase hover:bg-gray-100"
              >
                Tentar Novamente
              </Button>
              <Link href="/admin/login" className="flex-1">
                <Button className="w-full border-2 border-gray-900 bg-gray-900 font-bold uppercase text-white hover:bg-orange-street hover:border-orange-street">
                  Voltar ao Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
