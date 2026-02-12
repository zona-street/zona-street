"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/useAuth";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuth((state) => state.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Produtos" },
    { href: "/admin/orders", label: "Pedidos" },
  ];

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className={`space-y-2 ${isMobile ? "" : ""}`}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => isMobile && setMobileMenuOpen(false)}
          className={`block rounded-md border-2 px-4 py-3 font-bold uppercase tracking-wide transition-colors hover:border-orange-street hover:bg-orange-street/10 ${
            isActive(item.href)
              ? "border-orange-street bg-orange-street/10"
              : "border-transparent"
          }`}
        >
          {item.label}
        </Link>
      ))}
      <Link
        href="/"
        onClick={() => isMobile && setMobileMenuOpen(false)}
        className="block rounded-md border-2 px-4 py-3 font-bold uppercase tracking-wide transition-colors hover:border-orange-street hover:bg-orange-street/10 border-transparent"
      >
        Voltar para o site
      </Link>
      <button
        onClick={() => {
          handleLogout();
          if (isMobile) setMobileMenuOpen(false);
        }}
        className="mt-auto block w-full rounded-md border-2 border-transparent px-4 py-3 font-bold uppercase tracking-wide text-left transition-colors hover:border-red-500 hover:bg-red-500/10 hover:text-red-500"
      >
        Sair
      </button>
    </nav>
  );

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b-2 border-gray-900 bg-gray-900 px-4 py-3 text-white">
          <div>
            <h1 className="text-lg font-black uppercase tracking-wide">
              Zona Street
            </h1>
            <p className="text-xs font-medium text-gray-400">Admin</p>
          </div>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 border-white bg-transparent text-white hover:bg-white hover:text-gray-900"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] max-w-sm border-l border-gray-200 bg-gray-900 text-white"
            >
              <SheetHeader className="mb-6 mt-4">
                <SheetTitle className="text-xl font-black uppercase tracking-wide text-white">
                  Menu Admin
                </SheetTitle>
                <SheetDescription className="text-sm font-medium text-gray-400">
                  Navegação
                </SheetDescription>
              </SheetHeader>
              <NavLinks isMobile />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r-2 border-gray-900 bg-gray-900 p-6 text-white">
            <div className="mb-8">
              <h1 className="text-2xl font-black uppercase tracking-wide">
                Zona Street
              </h1>
              <p className="text-sm font-medium text-gray-400">
                Painel Administrativo
              </p>
            </div>
            <NavLinks />
          </aside>

          {/* Main Content */}
          <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
