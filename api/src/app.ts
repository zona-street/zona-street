import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "./config/app.config";
import { productRoutes } from "./routes/product.routes";

/**
 * Cria e configura a instância do Fastify
 */
export async function buildApp() {
  const fastify = Fastify({
    logger: config.enableLogging
      ? {
          transport: {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          },
        }
      : false,
  });

  // Registro do CORS
  await fastify.register(cors, {
    origin: config.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });

  // Health check
  fastify.get("/health", async () => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: config.env,
    };
  });

  // Registro das rotas de produtos
  fastify.register(productRoutes, { prefix: `${config.apiPrefix}/products` });

  // Handler de erro global
  fastify.setErrorHandler((error, request, reply) => {
    if (config.isDevelopment) {
      fastify.log.error(error);
    }

    // Erro de validação Zod
    if (error.name === "ZodError") {
      return reply.status(400).send({
        success: false,
        error: "Erro de validação",
        details: error.message,
      });
    }

    // Outros erros
    return reply.status(error.statusCode || 500).send({
      success: false,
      error: error.message || "Erro interno do servidor",
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
