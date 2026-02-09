"use client";

import { useEffect, useState } from "react";
import { ordersApi, Order, OrderWithItems } from "@/lib/api/orders";
import { useAuth } from "@/lib/store/useAuth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Loader2, Check, X, ExternalLink, Eye } from "lucide-react";
import Image from "next/image";

export function AdminOrdersTemplate() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadOrders() {
    if (!token) return;

    try {
      setLoading(true);
      const data = await ordersApi.getAll(token);
      setOrders(data);
    } catch (error) {
      toast.error("Erro ao carregar pedidos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function viewOrderDetails(orderId: string) {
    if (!token) return;

    try {
      const data = await ordersApi.getById(orderId, token);
      setSelectedOrder(data);
      setDialogOpen(true);
    } catch (error) {
      toast.error("Erro ao carregar detalhes do pedido");
      console.error(error);
    }
  }

  async function handleValidate(orderId: string) {
    if (!token) return;

    try {
      setActionLoading(true);
      await ordersApi.validate(orderId, token);
      toast.success("Pedido validado e estoque abatido com sucesso!");
      await loadOrders();
      setDialogOpen(false);
    } catch (error) {
      toast.error((error as Error).message || "Erro ao validar pedido");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel(orderId: string) {
    if (!token) return;

    try {
      setActionLoading(true);
      await ordersApi.cancel(orderId, token);
      toast.success("Pedido cancelado com sucesso!");
      await loadOrders();
      setDialogOpen(false);
    } catch (error) {
      toast.error((error as Error).message || "Erro ao cancelar pedido");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  }

  function getStatusBadge(status: Order["status"]) {
    const styles = {
      PENDENTE: "border-orange-street bg-orange-street text-white",
      CONCLUIDO: "border-green-600 bg-green-600 text-white",
      CANCELADO: "border-gray-900 bg-gray-900 text-white",
    };

    const labels = {
      PENDENTE: "Pendente",
      CONCLUIDO: "Concludo",
      CANCELADO: "Cancelado",
    };

    return (
      <Badge
        className={`border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${styles[status]}`}
      >
        {labels[status]}
      </Badge>
    );
  }

  function formatWhatsAppLink(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, "");
    return `https://wa.me/55${cleanPhone}`;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-gray-900 pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900">
            Pedidos
          </h1>
          <p className="mt-2 text-lg font-medium text-gray-600">
            Gerencie os pedidos da loja
          </p>
        </div>
      </div>

      {/* Tabela de pedidos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-street" />
        </div>
      ) : orders.length === 0 ? (
        <div className="border-2 border-gray-200 bg-white p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Package className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-bold uppercase text-gray-900">
            Nenhum pedido encontrado
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Os pedidos aparecero aqui quando forem criados
          </p>
        </div>
      ) : (
        <div className="border-2 border-gray-900 bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-gray-900 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-900">
                    Pedido
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-900">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-900">
                    WhatsApp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-900">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-900">
                    Data
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-900">
                    Aes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono font-bold text-gray-900">
                        #{order.id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">
                        {order.customerName}
                      </p>
                      {order.customerEmail && (
                        <p className="text-xs text-gray-500">
                          {order.customerEmail}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={formatWhatsAppLink(order.customerPhone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700"
                      >
                        {order.customerPhone}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">
                        R$ {Number(order.total).toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString("pt-BR")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewOrderDetails(order.id)}
                          className="border-2 border-gray-900 font-bold uppercase"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dialog de detalhes do pedido */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="min-w-[600px] max-h-[90vh] overflow-y-auto overflow-x-hidden border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase">
              Detalhes do Pedido
            </DialogTitle>
            <DialogDescription>Visualize e gerencie o pedido</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Info do pedido */}
              <div className="border-2 border-gray-900 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">
                      Pedido
                    </p>
                    <p className="font-mono text-sm font-bold">
                      #{selectedOrder.order.id.slice(0, 8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">
                      Status
                    </p>
                    {getStatusBadge(selectedOrder.order.status)}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">
                      Cliente
                    </p>
                    <p className="text-sm font-bold">
                      {selectedOrder.order.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">
                      WhatsApp
                    </p>
                    <a
                      href={formatWhatsAppLink(
                        selectedOrder.order.customerPhone
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700"
                    >
                      {selectedOrder.order.customerPhone}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {selectedOrder.order.notes && (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase text-gray-500">
                      Observaes
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedOrder.order.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Itens do pedido */}
              <div>
                <h3 className="mb-3 text-lg font-bold uppercase text-gray-900">
                  Itens do Pedido
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-2 border-gray-200 p-3"
                    >
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Tamanho: {item.size} | Qtd: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          R$ {Number(item.subtotal).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          R$ {Number(item.productPrice).toFixed(2)} cada
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 border-t-2 border-gray-900 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black uppercase text-gray-900">
                      Total
                    </p>
                    <p className="text-2xl font-black text-gray-900">
                      R$ {Number(selectedOrder.order.total).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Aes */}
              {selectedOrder.order.status === "PENDENTE" && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => handleValidate(selectedOrder.order.id)}
                    disabled={actionLoading}
                    className="flex-1 border-2 border-green-600 bg-green-600 font-bold uppercase text-white hover:bg-green-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {actionLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Validar Pedido
                  </Button>
                  <Button
                    onClick={() => handleCancel(selectedOrder.order.id)}
                    disabled={actionLoading}
                    variant="outline"
                    className="flex-1 border-2 border-gray-900 font-bold uppercase hover:bg-gray-100"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
