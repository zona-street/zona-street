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
    handler: authController.register.bind(authController),
  });

  // POST /auth/login - Autentica um usuário
  fastify.post("/login", {
    handler: authController.login.bind(authController),
  });

  // GET /auth/me - Retorna o usuário autenticado (protegida)
  fastify.get("/me", {
    onRequest: [fastify.authenticate],
    handler: authController.me.bind(authController),
  });
}
