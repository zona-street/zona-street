"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuth((state) => state.logout);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        {/* TODO: Adicionar Sidebar de navegação admin */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 h-full w-64 border-r-2 border-gray-900 bg-gray-900 p-6 text-white">
            <div className="mb-8">
              <h1 className="text-2xl font-black uppercase tracking-wide">
                Zona Street
              </h1>
              <p className="text-sm font-medium text-gray-400">
                Painel Administrativo
              </p>
            </div>

            <nav className="space-y-2">
              <Link
                href="/admin"
                className={`block rounded-md border-2 px-4 py-3 font-bold uppercase tracking-wide transition-colors hover:border-orange-street hover:bg-orange-street/10 ${
                  isActive("/admin")
                    ? "border-orange-street bg-orange-street/10"
                    : "border-transparent"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className={`block rounded-md border-2 px-4 py-3 font-bold uppercase tracking-wide transition-colors hover:border-orange-street hover:bg-orange-street/10 ${
                  isActive("/admin/products")
                    ? "border-orange-street bg-orange-street/10"
                    : "border-transparent"
                }`}
              >
                Produtos
              </Link>
              <Link
                href="/admin/orders"
                className={`block rounded-md border-2 px-4 py-3 font-bold uppercase tracking-wide transition-colors hover:border-orange-street hover:bg-orange-street/10 ${
                  isActive("/admin/orders")
                    ? "border-orange-street bg-orange-street/10"
                    : "border-transparent"
                }`}
              >
                Pedidos
              </Link>
              <Link
                href="/admin/customers"
                className={`block rounded-md border-2 px-4 py-3 font-bold uppercase tracking-wide transition-colors hover:border-orange-street hover:bg-orange-street/10 ${
                  isActive("/admin/customers")
                    ? "border-orange-street bg-orange-street/10"
                    : "border-transparent"
                }`}
              >
                Clientes
              </Link>

              <button
                onClick={handleLogout}
                className="mt-auto block w-full rounded-md border-2 border-transparent px-4 py-3 font-bold uppercase tracking-wide text-left transition-colors hover:border-red-500 hover:bg-red-500/10 hover:text-red-500"
              >
                Sair
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          {/* Main Content */}
          <main className="ml-64 flex-1 p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
