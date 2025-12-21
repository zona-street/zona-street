import type { FastifyInstance } from "fastify";
import { SubscriberController } from "../controllers/subscriber.controller";

/**
 * Subscriber Routes
 */
export async function subscriberRoutes(fastify: FastifyInstance) {
  const subscriberController = new SubscriberController();

  // POST /subscribers - Cadastra um novo assinante (público)
  fastify.post("/", {
    handler: subscriberController.subscribe.bind(subscriberController),
  });

  // GET /subscribers - Lista todos os assinantes (apenas admins)
  fastify.get("/", {
    onRequest: [fastify.requireAdmin],
    handler: subscriberController.list.bind(subscriberController),
  });

  // DELETE /subscribers/:email - Remove um assinante (público)
  fastify.delete("/:email", {
    handler: subscriberController.unsubscribe.bind(subscriberController),
  });
}
