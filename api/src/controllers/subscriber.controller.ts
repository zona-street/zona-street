import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { SubscriberService } from "../services/subscriber.service";

/**
 * Validation schemas
 */
const subscribeSchema = z.object({
  email: z.string().email("Email inválido"),
});

/**
 * Subscriber Controller
 */
export class SubscriberController {
  private subscriberService: SubscriberService;

  constructor() {
    this.subscriberService = new SubscriberService();
  }

  /**
   * POST /subscribers - Cadastra um novo assinante
   */
  async subscribe(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = subscribeSchema.parse(request.body);

      const subscriber = await this.subscriberService.subscribe(body.email);

      return reply.status(201).send({
        success: true,
        data: subscriber,
        message:
          "Cadastro realizado com sucesso! Você receberá novidades sobre nossos produtos.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: "Email inválido",
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        return reply.status(400).send({
          success: false,
          error: error.message,
        });
      }

      return reply.status(500).send({
        success: false,
        error: "Erro ao cadastrar na newsletter",
      });
    }
  }

  /**
   * GET /subscribers - Lista todos os assinantes (apenas admins)
   */
  async list(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const subscribers = await this.subscriberService.getAllSubscribers();

      return reply.send({
        success: true,
        data: subscribers,
        meta: {
          total: subscribers.length,
        },
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: "Erro ao listar assinantes",
      });
    }
  }

  /**
   * DELETE /subscribers/:email - Remove um assinante
   */
  async unsubscribe(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email } = request.params as { email: string };

      await this.subscriberService.unsubscribe(email);

      return reply.send({
        success: true,
        message: "Você foi removido da newsletter com sucesso",
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(404).send({
          success: false,
          error: error.message,
        });
      }

      return reply.status(500).send({
        success: false,
        error: "Erro ao remover da newsletter",
      });
    }
  }
}
