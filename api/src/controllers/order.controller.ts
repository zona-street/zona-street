import { FastifyRequest, FastifyReply } from "fastify";
import { OrderService } from "../services/order.service";
import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string(),
  productPrice: z.number().positive(),
  productImage: z.string().url(),
  size: z.string(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(10),
  customerEmail: z.string().email().optional(),
  items: z.array(orderItemSchema).min(1),
  notes: z.string().optional(),
});

const updateOrderSchema = z.object({
  customerName: z.string().min(2).optional(),
  customerPhone: z.string().min(10).optional(),
  customerEmail: z.string().email().optional(),
  total: z.number().positive().optional(),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).optional(),
});

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  /**
   * POST /orders - Criar novo pedido
   */
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createOrderSchema.parse(request.body);
      const result = await this.orderService.createOrder(data);

      return reply.status(201).send({
        success: true,
        message: "Pedido criado com sucesso",
        data: result,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: "Dados inválidos",
          errors: error.errors,
        });
      }

      console.error("Erro ao criar pedido:", error);
      return reply.status(500).send({
        success: false,
        message: error.message || "Erro ao criar pedido",
      });
    }
  }

  /**
   * GET /orders - Listar todos os pedidos
   */
  async getAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const orders = await this.orderService.getAllOrders();

      return reply.send({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      console.error("Erro ao buscar pedidos:", error);
      return reply.status(500).send({
        success: false,
        message: error.message || "Erro ao buscar pedidos",
      });
    }
  }

  /**
   * GET /orders/:id - Buscar pedido por ID
   */
  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const order = await this.orderService.getOrderById(id);

      if (!order) {
        return reply.status(404).send({
          success: false,
          message: "Pedido não encontrado",
        });
      }

      return reply.send({
        success: true,
        data: order,
      });
    } catch (error: any) {
      console.error("Erro ao buscar pedido:", error);
      return reply.status(500).send({
        success: false,
        message: error.message || "Erro ao buscar pedido",
      });
    }
  }

  /**
   * PUT /orders/:id - Atualizar pedido
   */
  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = updateOrderSchema.parse(request.body);

      const result = await this.orderService.updateOrder(id, data);

      return reply.send({
        success: true,
        message: "Pedido atualizado com sucesso",
        data: result,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: "Dados inválidos",
          errors: error.errors,
        });
      }

      console.error("Erro ao atualizar pedido:", error);
      return reply.status(500).send({
        success: false,
        message: error.message || "Erro ao atualizar pedido",
      });
    }
  }

  /**
   * PATCH /orders/:id/validate - Validar pedido e abater estoque
   */
  async validate(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const order = await this.orderService.validateOrder(id);

      return reply.send({
        success: true,
        message: "Pedido validado e estoque abatido com sucesso",
        data: order,
      });
    } catch (error: any) {
      console.error("Erro ao validar pedido:", error);
      return reply.status(400).send({
        success: false,
        message: error.message || "Erro ao validar pedido",
      });
    }
  }

  /**
   * PATCH /orders/:id/cancel - Cancelar pedido
   */
  async cancel(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const order = await this.orderService.cancelOrder(id);

      return reply.send({
        success: true,
        message: "Pedido cancelado com sucesso",
        data: order,
      });
    } catch (error: any) {
      console.error("Erro ao cancelar pedido:", error);
      return reply.status(400).send({
        success: false,
        message: error.message || "Erro ao cancelar pedido",
      });
    }
  }

  /**
   * GET /orders/stats - Obter estatísticas de pedidos
   */
  async getStats(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await this.orderService.getStats();

      return reply.send({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error("Erro ao buscar estatísticas:", error);
      return reply.status(500).send({
        success: false,
        message: error.message || "Erro ao buscar estatísticas",
      });
    }
  }
}
