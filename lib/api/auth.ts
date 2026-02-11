import type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "@/lib/types/auth";
import { getApiUrl, fetchWithTimeout } from "@/lib/utils/api";

const API_URL = getApiUrl();

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

  /**
   * Troca a senha do usuário autenticado
   */
  async changePassword(
    token: string,
    data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao alterar senha");
    }

    return response.json();
  },

  /**
   * Solicita reset de senha via email
   */
  async forgotPassword(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao solicitar reset de senha");
    }

    return response.json();
  },

  /**
   * Redefine a senha com token
   */
  async resetPassword(data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao redefinir senha");
    }

    return response.json();
  },
};
