"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Users, Package, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 5, // Temos 5 produtos no seed
    revenue: 0,
  });

  useEffect(() => {
    // TODO: Buscar estatísticas reais da API
    setStats({
      totalOrders: 127,
      totalCustomers: 89,
      totalProducts: 5,
      revenue: 45890.5,
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-lg font-medium text-gray-600">
          Visão geral do seu e-commerce
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
                R$ {stats.revenue.toLocaleString("pt-BR")}
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
                {stats.totalOrders}
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
                Clientes
              </p>
              <p className="mt-2 text-3xl font-black text-gray-900">
                {stats.totalCustomers}
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
                {stats.totalProducts}
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
        <div className="grid gap-4 md:grid-cols-3">
          <button className="border-2 border-gray-900 bg-gray-900 px-6 py-4 font-bold uppercase tracking-wide text-white transition-all hover:bg-orange-street hover:border-orange-street shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            + Novo Produto
          </button>
          <button className="border-2 border-gray-900 bg-white px-6 py-4 font-bold uppercase tracking-wide text-gray-900 transition-all hover:bg-gray-900 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Ver Pedidos
          </button>
          <button className="border-2 border-gray-900 bg-white px-6 py-4 font-bold uppercase tracking-wide text-gray-900 transition-all hover:bg-gray-900 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Relatórios
          </button>
        </div>
      </div>

      {/* Placeholder for future charts/tables */}
      <div className="border-2 border-gray-200 bg-white p-8">
        <p className="text-center text-sm font-medium text-gray-500">
          📊 Gráficos e tabelas serão implementados nas próximas sprints
        </p>
      </div>
    </div>
  );
}
