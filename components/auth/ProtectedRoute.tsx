"use client";

import { useEffect } from "react";
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

  useEffect(() => {
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
  }, [isAuthenticated, isAdmin, requireAdmin, router]);

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-900 border-t-orange-street mx-auto mb-4"></div>
          <p className="text-sm font-bold uppercase tracking-wide text-gray-600">
            Verificando permissões...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
