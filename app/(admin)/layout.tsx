import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Zona Street",
  description: "Painel administrativo da Zona Street",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
            <a
              href="/admin"
              className="block rounded-md border-2 border-transparent px-4 py-3 font-bold uppercase tracking-wide transition-colors hover:border-orange-street hover:bg-orange-street/10"
            >
              Dashboard
            </a>
            <a
              href="/admin/products"
              className="block rounded-md border-2 border-transparent px-4 py-3 font-bold uppercase tracking-wide transition-colors hover:border-orange-street hover:bg-orange-street/10"
            >
              Produtos
            </a>
            <a
              href="/admin/orders"
              className="block rounded-md border-2 border-transparent px-4 py-3 font-bold uppercase tracking-wide transition-colors hover:border-orange-street hover:bg-orange-street/10"
            >
              Pedidos
            </a>
            <a
              href="/admin/customers"
              className="block rounded-md border-2 border-transparent px-4 py-3 font-bold uppercase tracking-wide transition-colors hover:border-orange-street hover:bg-orange-street/10"
            >
              Clientes
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
