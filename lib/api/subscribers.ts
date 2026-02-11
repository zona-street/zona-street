import { getApiUrl, fetchWithTimeout } from "@/lib/utils/api";

const API_URL = getApiUrl();

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export const subscribersApi = {
  // Buscar todos os assinantes (Admin)
  async getAll(token: string): Promise<Subscriber[]> {
    try {
      if (!token) {
        console.error("Token não fornecido");
        return [];
      }

      const response = await fetch(`${API_URL}/subscribers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // Sempre buscar dados atualizados
      });

      if (!response.ok) {
        console.error("Erro ao buscar assinantes:", response.statusText);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch (error) {
      console.error("Erro ao buscar assinantes:", error);
      return [];
    }
  },

  // Contar total de assinantes (Admin)
  async count(token: string): Promise<number> {
    try {
      const subscribers = await this.getAll(token);
      return Array.isArray(subscribers) ? subscribers.length : 0;
    } catch (error) {
      console.error("Erro ao contar assinantes:", error);
      return 0;
    }
  },
};
