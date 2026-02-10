"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Users, Package, TrendingUp } from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { subscribersApi } from "@/lib/api/subscribers";
import { ordersApi } from "@/lib/api/orders";
import { useAuth } from "@/lib/store/useAuth";
import { toast } from "sonner";

interface DashboardStats {
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Buscar dados reais em paralelo
        const results = await Promise.allSettled([
          productsApi.getAll(),
          subscribersApi.count(token),
          ordersApi.getStats(token),
        ]);

        const products =
          results[0].status === "fulfilled" ? results[0].value : [];
        const subscribersCount =
          results[1].status === "fulfilled" ? results[1].value : 0;
        const orderStats =
          results[2].status === "fulfilled"
            ? results[2].value
            : { totalSales: 0, ordersByStatus: {} };

        const pendingOrders = orderStats.ordersByStatus.PENDENTE || 0;
        const completedOrders = orderStats.ordersByStatus.CONCLUIDO || 0;
        const cancelledOrders = orderStats.ordersByStatus.CANCELADO || 0;
        const totalOrders = pendingOrders + completedOrders + cancelledOrders;

        setStats({
          totalOrders,
          totalCustomers: subscribersCount || 0,
          totalProducts: Array.isArray(products) ? products.length : 0,
          revenue: orderStats.totalSales || 0,
          pendingOrders,
          completedOrders,
          cancelledOrders,
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        toast.error("Erro ao carregar estatísticas do dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-lg font-medium text-gray-600">
          Visão geral do e-commerce Zona Street
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="border-2 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-600">
                Faturamento
              </p>
              <p className="mt-2 text-3xl font-black text-gray-900">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  `R$ ${stats.revenue.toLocaleString("pt-BR")}`
                )}
              </p>
            </div>
            <div className="rounded-full border-2 border-gray-900 bg-orange-street p-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Total Orders */}
        <Card className="border-2 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-600">
                Pedidos
              </p>
              <p className="mt-2 text-3xl font-black text-gray-900">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  stats.totalOrders
                )}
              </p>
            </div>
            <div className="rounded-full border-2 border-gray-900 bg-blue-street p-3">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Total Customers */}
        <Card className="border-2 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-600">
                Assinantes
              </p>
              <p className="mt-2 text-3xl font-black text-gray-900">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  stats.totalCustomers
                )}
              </p>
            </div>
            <div className="rounded-full border-2 border-gray-900 bg-green-600 p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Total Products */}
        <Card className="border-2 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-600">
                Produtos
              </p>
              <p className="mt-2 text-3xl font-black text-gray-900">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  stats.totalProducts
                )}
              </p>
            </div>
            <div className="rounded-full border-2 border-gray-900 bg-purple-600 p-3">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="border-2 border-gray-900 bg-white p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-gray-900">
          Ações Rápidas
        </h2>
        <div className="flex gap-4">
          <a
            href="/admin/products"
            className="border-2 border-gray-900 bg-gray-900 px-6 py-4 font-bold uppercase tracking-wide text-white transition-all hover:bg-orange-street hover:border-orange-street shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            + Novo Produto
          </a>
          <button
            onClick={() =>
              toast.info(
                "Gráficos e relatórios poderão ser implementados no futuro.",
              )
            }
            className="border-2 border-gray-900 bg-white px-6 py-4 font-bold uppercase tracking-wide text-gray-900 transition-all hover:bg-gray-900 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Relatórios
          </button>
          <a
            href="/admin/settings"
            className="border-2 border-gray-900 bg-white px-6 py-4 font-bold uppercase tracking-wide text-gray-900 transition-all hover:bg-gray-900 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            ⚙️ Configurações
          </a>
        </div>
      </div>

      {/* Placeholder for future charts/tables */}
      <div className="border-2 border-gray-200 bg-white p-8">
        <p className="text-center text-sm font-medium text-gray-500">
          Gráficos e relatórios poderão ser implementados no futuro.
        </p>
      </div>
    </div>
  );
}
