"use client";

import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/store/useCart";
import { useCartSheet } from "@/lib/store/useCartSheet";
import { ordersApi } from "@/lib/api/orders";
import { toast } from "sonner";
import { useState } from "react";

const WHATSAPP_NUMBER = "5524992060913";

export function CartSheet() {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = useCart();
  const { isOpen, closeCart, toggleCart } = useCartSheet();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Carrinho vazio", {
        description: "Adicione produtos antes de finalizar o pedido.",
      });
      return;
    }

    // Validar dados do cliente
    if (!customerName.trim()) {
      toast.error("Nome obrigatório", {
        description: "Por favor, informe seu nome.",
      });
      return;
    }

    if (!customerPhone.trim()) {
      toast.error("Telefone obrigatório", {
        description: "Por favor, informe seu telefone.",
      });
      return;
    }

    try {
      setIsCheckingOut(true);

      // Criar pedido no banco de dados
      const orderData = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          productPrice: item.price,
          productImage: item.image,
          size: item.size,
          quantity: item.quantity,
        })),
      };

      const result = await ordersApi.create(orderData);

      // Preparar mensagem do WhatsApp
      const message = formatWhatsAppMessage(result.order.id);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

      // Abrir WhatsApp
      window.open(whatsappUrl, "_blank");

      // Limpar carrinho e fechar sheet
      clearCart();
      closeCart();
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");

      toast.success("Pedido criado com sucesso!", {
        description: "Continue a conversa no WhatsApp para finalizar.",
      });
    } catch (error: any) {
      toast.error("Erro ao criar pedido", {
        description: error.message || "Tente novamente.",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatWhatsAppMessage = (orderId?: string) => {
    const header = `*NOVO PEDIDO - ZONA STREET*\n${
      orderId ? `ID: #${orderId.slice(0, 8)}\n` : ""
    }\n`;
    const divider = "--------------------------\n";

    const itemsList = items
      .map((item, index) => {
        const subtotal = item.price * item.quantity;
        return (
          `${divider}` +
          `*Item ${index + 1}: ${item.name}*\n` +
          `Tamanho: *${item.size}*\n` +
          `Qtd: ${item.quantity}x - R$ ${item.price.toFixed(2)}\n` +
          `Subtotal: *R$ ${subtotal.toFixed(2)}*\n`
        );
      })
      .join("");

    const total = `${divider}\n*TOTAL: R$ ${getTotalPrice().toFixed(2)}*`;

    const footer = `\n\n_Ol, sou ${customerName}. Gostaria de finalizar este pedido._`;

    return encodeURIComponent(header + itemsList + total + footer);
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="relative border-2 border-gray-900 bg-gray-900 font-bold text-white hover:bg-transparent hover:text-gray-900"
        >
          <ShoppingCart className="h-5 w-5" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full border-2 border-white bg-orange-street p-0 text-xs font-bold text-white">
              {getTotalItems()}
            </Badge>
          )}
          <span className="sr-only">Carrinho</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col border-l-2 border-gray-900 bg-white sm:max-w-lg overflow-visible">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between text-xl font-bold uppercase tracking-wide">
            <span>Carrinho</span>
            {items.length > 0 && (
              <Badge className="border-2 border-orange-street bg-orange-street text-white font-bold mr-7">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "itens"}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full border-4 border-gray-200 p-8">
              <ShoppingCart className="h-16 w-16 text-gray-300" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900">
                Seu carrinho est vazio
              </h3>
              <p className="text-sm text-gray-500">
                Adicione produtos incrveis da Zona Street!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="group relative flex gap-4 border-2 border-gray-900 bg-white p-4 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {/* Imagem do produto */}
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center border-2 border-gray-900 bg-gray-50 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-black text-gray-300">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="line-clamp-2 text-sm font-bold leading-tight text-gray-900">
                        {item.name}
                      </h4>
                      <p className="mt-1 text-xs font-medium uppercase text-gray-500">
                        Tamanho: {item.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-2 border-gray-900 bg-white hover:bg-orange-street hover:text-white transition-colors"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity - 1,
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-bold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-2 border-gray-900 bg-white hover:bg-orange-street hover:text-white transition-colors"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity + 1,
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Boto de remover */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 border-2 border-gray-900 bg-white text-gray-900 hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors"
                    onClick={() => removeItem(item.id, item.size)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t-2 border-gray-200 pt-4 px-4 pb-6">
              {/* Formulrio de dados do cliente */}
              <div className="space-y-3 border-2 border-gray-900 p-4 bg-gray-50">
                <h3 className="text-sm font-bold uppercase text-gray-900">
                  Seus Dados
                </h3>
                <div>
                  <Label
                    htmlFor="customer-name"
                    className="text-xs font-bold uppercase"
                  >
                    Nome Completo *
                  </Label>
                  <Input
                    id="customer-name"
                    type="text"
                    placeholder="Digite seu nome"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 border-2 border-gray-900"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="customer-phone"
                    className="text-xs font-bold uppercase"
                  >
                    WhatsApp *
                  </Label>
                  <Input
                    id="customer-phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="mt-1 border-2 border-gray-900"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="customer-email"
                    className="text-xs font-bold uppercase"
                  >
                    E-mail (Opcional)
                  </Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="mt-1 border-2 border-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">Subtotal</span>
                  <span className="font-bold text-gray-900">
                    R$ {getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-bold uppercase text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    R$ {getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full border-2 border-gray-900 bg-green-600 py-6 text-base font-bold uppercase tracking-wide text-white  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-0 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                <FaWhatsapp className="mr-2 h-5 w-5" />
                {isCheckingOut ? "Criando Pedido..." : "Finalizar no WhatsApp"}
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-900 bg-white py-4 font-bold text-gray-900 hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors"
                onClick={clearCart}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar Carrinho
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
