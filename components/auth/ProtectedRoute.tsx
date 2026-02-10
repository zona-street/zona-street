"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/useAuth";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Dar tempo para o Zustand carregar do localStorage
    const timer = setTimeout(() => {
      setIsChecking(false);

      if (!isAuthenticated) {
        toast.error("Acesso negado", {
          description: "Você precisa fazer login para acessar esta página",
        });
        router.push("/admin/login");
        return;
      }

      if (requireAdmin && !isAdmin) {
        toast.error("Acesso negado", {
          description: "Você não tem permissão para acessar esta página",
        });
        router.push("/");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isAdmin, requireAdmin, router]);

  // Loading enquanto verifica autenticao
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-900 border-t-orange-street mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticao...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado ou não é admin quando necessário, não renderiza nada
  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
