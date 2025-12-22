import { OrderRepository } from "../repositories/order.repository";
import { NewOrder, NewOrderItem, Order, OrderItem } from "../db/schema";

interface CreateOrderDTO {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: Array<{
    productId: string;
    productName: string;
    productPrice: number;
    productImage: string;
    size: string;
    quantity: number;
  }>;
  notes?: string;
}

interface UpdateOrderDTO {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  total?: number;
  notes?: string;
  items?: Array<{
    productId: string;
    productName: string;
    productPrice: number;
    productImage: string;
    size: string;
    quantity: number;
  }>;
}

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  /**
   * Criar novo pedido
   */
  async createOrder(
    data: CreateOrderDTO
  ): Promise<{ order: Order; items: OrderItem[] }> {
    // Calcular total
    const total = data.items.reduce((sum, item) => {
      return sum + item.productPrice * item.quantity;
    }, 0);

    // Preparar dados do pedido
    const orderData: NewOrder = {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      total: total.toString(),
      status: "PENDENTE",
      notes: data.notes,
    };

    // Preparar itens
    const items: NewOrderItem[] = data.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      productPrice: item.productPrice.toString(),
      productImage: item.productImage,
      size: item.size,
      quantity: item.quantity.toString(),
      subtotal: (item.productPrice * item.quantity).toString(),
      orderId: "", // Será preenchido no repository
    }));

    return await this.orderRepository.create(orderData, items);
  }

  /**
   * Buscar pedido por ID
   */
  async getOrderById(
    orderId: string
  ): Promise<{ order: Order; items: OrderItem[] } | null> {
    return await this.orderRepository.findById(orderId);
  }

  /**
   * Listar todos os pedidos
   */
  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }

  /**
   * Atualizar pedido
   */
  async updateOrder(
    orderId: string,
    data: UpdateOrderDTO
  ): Promise<{ order: Order; items?: OrderItem[] }> {
    // Buscar pedido atual
    const current = await this.orderRepository.findById(orderId);
    if (!current) {
      throw new Error("Pedido não encontrado");
    }

    // Verificar se pode ser editado
    if (current.order.status !== "PENDENTE") {
      throw new Error("Apenas pedidos PENDENTES podem ser editados");
    }

    // Atualizar dados básicos do pedido
    const updateData: Partial<NewOrder> = {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      notes: data.notes,
    };

    // Se houver novos itens, recalcular total
    if (data.items) {
      const newTotal = data.items.reduce((sum, item) => {
        return sum + item.productPrice * item.quantity;
      }, 0);
      updateData.total = newTotal.toString();
    } else if (data.total !== undefined) {
      updateData.total = data.total.toString();
    }

    // Atualizar pedido
    const updatedOrder = await this.orderRepository.update(orderId, updateData);

    if (!updatedOrder) {
      throw new Error("Erro ao atualizar pedido");
    }

    // Se houver novos itens, atualizar
    let updatedItems: OrderItem[] | undefined;
    if (data.items) {
      const items: NewOrderItem[] = data.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productPrice: item.productPrice.toString(),
        productImage: item.productImage,
        size: item.size,
        quantity: item.quantity.toString(),
        subtotal: (item.productPrice * item.quantity).toString(),
        orderId: orderId,
      }));

      updatedItems = await this.orderRepository.updateItems(orderId, items);
    }

    return { order: updatedOrder, items: updatedItems };
  }

  /**
   * Validar pedido e abater estoque
   */
  async validateOrder(orderId: string): Promise<Order> {
    return await this.orderRepository.validate(orderId);
  }

  /**
   * Cancelar pedido
   */
  async cancelOrder(orderId: string): Promise<Order> {
    const current = await this.orderRepository.findById(orderId);
    if (!current) {
      throw new Error("Pedido não encontrado");
    }

    if (current.order.status === "CONCLUIDO") {
      throw new Error("Pedidos CONCLUÍDOS não podem ser cancelados");
    }

    return await this.orderRepository.cancel(orderId);
  }

  /**
   * Obter estatísticas de pedidos
   */
  async getStats(): Promise<{
    totalSales: number;
    ordersByStatus: Record<string, number>;
  }> {
    const [totalSales, ordersByStatus] = await Promise.all([
      this.orderRepository.getTotalSales(),
      this.orderRepository.getCountByStatus(),
    ]);

    return {
      totalSales,
      ordersByStatus,
    };
  }
}
