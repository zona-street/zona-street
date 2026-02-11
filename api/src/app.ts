import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { config } from "./config/app.config";
import { productRoutes } from "./routes/product.routes";
import { authRoutes } from "./routes/auth.routes";
import { subscriberRoutes } from "./routes/subscriber.routes";
import { orderRoutes } from "./routes/order.routes";

/**
 * Cria e configura a instância do Fastify
 */
export async function buildApp() {
  const fastify = Fastify({
    logger: config.enableLogging
      ? config.isDevelopment
        ? {
            transport: {
              target: "pino-pretty",
              options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            },
          }
        : true
      : false,
  });

  // Registro do CORS
  await fastify.register(cors, {
    origin: config.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });

  // Registro do JWT
  await fastify.register(jwt, {
    secret:
      process.env.JWT_SECRET ||
      "zona-street-super-secret-key-change-in-production",
  });

  // Decorators de autenticação
  fastify.decorate("authenticate", async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({
        success: false,
        error: "Token inválido ou expirado",
      });
    }
  });

  fastify.decorate("requireAdmin", async function (request: any, reply: any) {
    try {
      await request.jwtVerify();

      if (request.user.role !== "admin") {
        return reply.status(403).send({
          success: false,
          error: "Acesso negado: apenas administradores",
        });
      }
    } catch (err) {
      reply.status(401).send({
        success: false,
        error: "Token inválido ou expirado",
      });
    }
  });

  // Health check
  fastify.get("/health", async () => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: config.env,
    };
  });

  // Registro das rotas de autenticação
  fastify.register(authRoutes, { prefix: `${config.apiPrefix}/auth` });

  // Registro das rotas de produtos
  fastify.register(productRoutes, { prefix: `${config.apiPrefix}/products` });

  // Registro das rotas de assinantes
  fastify.register(subscriberRoutes, {
    prefix: `${config.apiPrefix}/subscribers`,
  });

  // Registro das rotas de pedidos
  fastify.register(orderRoutes, { prefix: `${config.apiPrefix}` });

  // Handler de erro global
  fastify.setErrorHandler((error, _request, reply) => {
    if (config.isDevelopment) {
      fastify.log.error(error);
    }

    // Erro de validação Zod
    if ((error as any).name === "ZodError") {
      return reply.status(400).send({
        success: false,
        error: "Erro de validação",
        details: (error as any).message,
      });
    }

    // Outros erros
    return reply.status((error as any).statusCode || 500).send({
      success: false,
      error: (error as any).message || "Erro interno do servidor",
    });
  });

  // Not Found handler
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      error: "Rota não encontrada",
      path: request.url,
    });
  });

  return fastify;
}
