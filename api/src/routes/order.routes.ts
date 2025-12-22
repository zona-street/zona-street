import { FastifyInstance } from "fastify";
import { OrderController } from "../controllers/order.controller";

export async function orderRoutes(fastify: FastifyInstance) {
  const orderController = new OrderController();

  // Rotas públicas
  fastify.post("/orders", (request, reply) =>
    orderController.create(request, reply)
  );

  // Rotas protegidas (requerem autenticação de admin)
  fastify.get(
    "/orders",
    { preHandler: [fastify.authenticate] },
    (request, reply) => orderController.getAll(request, reply)
  );

  fastify.get(
    "/orders/stats",
    { preHandler: [fastify.authenticate] },
    (request, reply) => orderController.getStats(request, reply)
  );

  fastify.get(
    "/orders/:id",
    { preHandler: [fastify.authenticate] },
    (request, reply) => orderController.getById(request, reply)
  );

  fastify.put(
    "/orders/:id",
    { preHandler: [fastify.authenticate] },
    (request, reply) => orderController.update(request, reply)
  );

  fastify.patch(
    "/orders/:id/validate",
    { preHandler: [fastify.authenticate] },
    (request, reply) => orderController.validate(request, reply)
  );

  fastify.patch(
    "/orders/:id/cancel",
    { preHandler: [fastify.authenticate] },
    (request, reply) => orderController.cancel(request, reply)
  );
}
