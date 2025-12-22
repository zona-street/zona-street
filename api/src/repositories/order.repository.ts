import { db } from "../db";
import {
  orders,
  orderItems,
  products,
  Order,
  NewOrder,
  OrderItem,
  NewOrderItem,
} from "../db/schema";
import { eq, desc, sql } from "drizzle-orm";

export class OrderRepository {
  /**
   * Criar um novo pedido com seus itens
   */
  async create(
    orderData: NewOrder,
    items: NewOrderItem[]
  ): Promise<{ order: Order; items: OrderItem[] }> {
    return await db.transaction(async (tx) => {
      // Criar o pedido
      const [newOrder] = await tx.insert(orders).values(orderData).returning();

      // Criar os itens do pedido
      const itemsWithOrderId = items.map((item) => ({
        ...item,
        orderId: newOrder.id,
      }));

      const newItems = await tx
        .insert(orderItems)
        .values(itemsWithOrderId)
        .returning();

      return { order: newOrder, items: newItems };
    });
  }

  /**
   * Buscar pedido por ID com seus itens
   */
  async findById(
    orderId: string
  ): Promise<{ order: Order; items: OrderItem[] } | null> {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) {
      return null;
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    return { order, items };
  }

  /**
   * Listar todos os pedidos
   */
  async findAll(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  /**
   * Atualizar pedido
   */
  async update(
    orderId: string,
    data: Partial<NewOrder>
  ): Promise<Order | null> {
    const [updated] = await db
      .update(orders)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();

    return updated || null;
  }

  /**
   * Atualizar itens do pedido
   */
  async updateItems(
    orderId: string,
    newItems: NewOrderItem[]
  ): Promise<OrderItem[]> {
    return await db.transaction(async (tx) => {
      // Deletar itens antigos
      await tx.delete(orderItems).where(eq(orderItems.orderId, orderId));

      // Inserir novos itens
      const itemsWithOrderId = newItems.map((item) => ({
        ...item,
        orderId,
      }));

      return await tx.insert(orderItems).values(itemsWithOrderId).returning();
    });
  }

  /**
   * Validar pedido e abater estoque
   */
  async validate(orderId: string): Promise<Order> {
    return await db.transaction(async (tx) => {
      // Buscar pedido e itens
      const order = await tx.query.orders.findFirst({
        where: eq(orders.id, orderId),
      });

      if (!order) {
        throw new Error("Pedido não encontrado");
      }

      if (order.status !== "PENDENTE") {
        throw new Error("Apenas pedidos PENDENTES podem ser validados");
      }

      const items = await tx
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      // Abater estoque de cada produto
      for (const item of items) {
        const [product] = await tx
          .select()
          .from(products)
          .where(eq(products.id, item.productId));

        if (!product) {
          throw new Error(`Produto ${item.productName} não encontrado`);
        }

        const currentStock = Number(product.stock);
        const quantityToRemove = Number(item.quantity);

        if (currentStock < quantityToRemove) {
          throw new Error(
            `Estoque insuficiente para ${item.productName}. Disponível: ${currentStock}, Solicitado: ${quantityToRemove}`
          );
        }

        // Atualizar estoque
        await tx
          .update(products)
          .set({
            stock: sql`${products.stock} - ${quantityToRemove}`,
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.productId));
      }

      // Atualizar status do pedido
      const [validated] = await tx
        .update(orders)
        .set({
          status: "CONCLUIDO",
          validatedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId))
        .returning();

      return validated;
    });
  }

  /**
   * Cancelar pedido
   */
  async cancel(orderId: string): Promise<Order> {
    const [cancelled] = await db
      .update(orders)
      .set({
        status: "CANCELADO",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    if (!cancelled) {
      throw new Error("Pedido não encontrado");
    }

    return cancelled;
  }

  /**
   * Obter total de vendas (apenas pedidos CONCLUIDO)
   */
  async getTotalSales(): Promise<number> {
    const result = await db
      .select({
        total: sql<string>`COALESCE(SUM(${orders.total}), 0)`,
      })
      .from(orders)
      .where(eq(orders.status, "CONCLUIDO"));

    return Number(result[0]?.total || 0);
  }

  /**
   * Obter contagem de pedidos por status
   */
  async getCountByStatus(): Promise<Record<string, number>> {
    const result = await db
      .select({
        status: orders.status,
        count: sql<string>`COUNT(*)`,
      })
      .from(orders)
      .groupBy(orders.status);

    return result.reduce((acc, row) => {
      acc[row.status] = Number(row.count);
      return acc;
    }, {} as Record<string, number>);
  }
}
