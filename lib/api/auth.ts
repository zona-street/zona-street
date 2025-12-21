import type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "@/lib/types/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1";

/**
 * API de Autenticação
 */
export const authApi = {
  /**
   * Registra um novo usuário
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao registrar usuário");
    }

    return response.json();
  },

  /**
   * Faz login de um usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao fazer login");
    }

    return response.json();
  },

  /**
   * Busca o usuário autenticado
   */
  async getMe(token: string): Promise<{ success: boolean; data: User }> {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao buscar usuário");
    }

    return response.json();
  },
};
