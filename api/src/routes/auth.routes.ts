import type { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";

/**
 * Auth Routes
 * Rotas de autenticação da API
 */
export async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController();

  // POST /auth/register - Registra um novo usuário
  fastify.post("/register", {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: "1 minute",
      },
    },
    handler: authController.register.bind(authController),
  });

  // POST /auth/login - Autentica um usuário
  fastify.post("/login", {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: "1 minute",
      },
    },
    handler: authController.login.bind(authController),
  });

  // GET /auth/me - Retorna o usuário autenticado (protegida)
  fastify.get("/me", {
    onRequest: [fastify.authenticate],
    handler: authController.me.bind(authController),
  });

  // PATCH /auth/change-password - Troca senha do usuário autenticado (protegida)
  fastify.patch("/change-password", {
    onRequest: [fastify.authenticate],
    handler: authController.changePassword.bind(authController),
  });

  // POST /auth/forgot-password - Solicita reset de senha via email (pública)
  fastify.post("/forgot-password", {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: "1 minute",
      },
    },
    handler: authController.forgotPassword.bind(authController),
  });

  // POST /auth/reset-password - Redefine senha com token (pública)
  fastify.post("/reset-password", {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: "1 minute",
      },
    },
    handler: authController.resetPassword.bind(authController),
  });
}
