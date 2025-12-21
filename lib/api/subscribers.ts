const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1";

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export const subscribersApi = {
  // Buscar todos os assinantes (Admin)
  async getAll(token: string): Promise<Subscriber[]> {
    const response = await fetch(`${API_URL}/subscribers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Sempre buscar dados atualizados
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar assinantes");
    }

    const data = await response.json();
    return data.data;
  },

  // Contar total de assinantes (Admin)
  async count(token: string): Promise<number> {
    const subscribers = await this.getAll(token);
    return subscribers.length;
  },
};
