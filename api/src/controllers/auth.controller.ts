import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { AuthService } from "../services/auth.service";

/**
 * Validation schemas
 */
const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["admin", "customer"]).optional().default("customer"),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

/**
 * Auth Controller
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /auth/register - Registra um novo usuário
   */
  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = registerSchema.parse(request.body);

      const user = await this.authService.register(
        body.email,
        body.password,
        body.role
      );

      // Gera o token JWT
      const token = request.server.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return reply.status(201).send({
        success: true,
        data: {
          user,
          token,
        },
        message: "Usuário registrado com sucesso",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: "Dados inválidos",
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
        error: "Erro ao registrar usuário",
      });
    }
  }

  /**
   * POST /auth/login - Autentica um usuário
   */
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = loginSchema.parse(request.body);

      const user = await this.authService.login(body.email, body.password);

      // Gera o token JWT
      const token = request.server.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return reply.send({
        success: true,
        data: {
          user,
          token,
        },
        message: "Login realizado com sucesso",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: "Dados inválidos",
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        return reply.status(401).send({
          success: false,
          error: error.message,
        });
      }

      return reply.status(500).send({
        success: false,
        error: "Erro ao fazer login",
      });
    }
  }

  /**
   * GET /auth/me - Retorna o usuário autenticado
   */
  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).id;
      const user = await this.authService.getUserById(userId);

      if (!user) {
        return reply.status(404).send({
          success: false,
          error: "Usuário não encontrado",
        });
      }

      return reply.send({
        success: true,
        data: user,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: "Erro ao buscar usuário",
      });
    }
  }
}
