"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/lib/store/useAuth";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Você precisa estar autenticado");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("As senhas não correspondem");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("A nova senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.changePassword(token, formData);

      toast.success(response.message || "Senha alterada com sucesso!");
      
      // Limpa o formulário
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Opcional: fazer logout para forçar novo login
      setTimeout(() => {
        toast.info("Faça login novamente com sua nova senha");
        logout();
        router.push("/admin/login");
      }, 2000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao alterar senha"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader>
        <CardTitle className="text-2xl font-black uppercase">
          Trocar Senha
        </CardTitle>
        <CardDescription>
          Altere sua senha de acesso ao painel de administração
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="font-bold">
              Senha Atual
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              required
              className="border-2 border-black"
              placeholder="Digite sua senha atual"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="font-bold">
              Nova Senha
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              required
              minLength={6}
              className="border-2 border-black"
              placeholder="Digite sua nova senha (mín. 6 caracteres)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-bold">
              Confirmar Nova Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              minLength={6}
              className="border-2 border-black"
              placeholder="Digite sua nova senha novamente"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            {loading ? "Alterando..." : "Alterar Senha"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
