import { getApiUrl, fetchWithTimeout } from "@/lib/utils/api";

const API_URL = getApiUrl();

export interface OrderItem {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  size: string;
  quantity: number;
}

export interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  notes?: string;
}

export interface UpdateOrderData {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  total?: number;
  notes?: string;
  items?: OrderItem[];
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  total: string;
  status: "PENDENTE" | "CONCLUIDO" | "CANCELADO";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  validatedAt?: string;
}

export interface OrderWithItems {
  order: Order;
  items: {
    id: string;
    orderId: string;
    productId: string;
    productName: string;
    productPrice: string;
    productImage: string;
    size: string;
    quantity: string;
    subtotal: string;
  }[];
}

export interface OrderStats {
  totalSales: number;
  ordersByStatus: Record<string, number>;
}

export const ordersApi = {
  /**
   * Criar novo pedido
   */
  async create(data: CreateOrderData): Promise<OrderWithItems> {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao criar pedido");
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Buscar todos os pedidos (requer autenticação)
   */
  async getAll(token: string): Promise<Order[]> {
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar pedidos");
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Buscar pedido por ID (requer autenticação)
   */
  async getById(orderId: string, token: string): Promise<OrderWithItems> {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar pedido");
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Atualizar pedido (requer autenticação)
   */
  async update(
    orderId: string,
    data: UpdateOrderData,
    token: string,
  ): Promise<OrderWithItems> {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao atualizar pedido");
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Validar pedido e abater estoque (requer autenticação)
   */
  async validate(orderId: string, token: string): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${orderId}/validate`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao validar pedido");
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Cancelar pedido (requer autenticação)
   */
  async cancel(orderId: string, token: string): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao cancelar pedido");
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Obter estatísticas de pedidos (requer autenticação)
   */
  async getStats(token: string): Promise<OrderStats> {
    const response = await fetch(`${API_URL}/orders/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar estatísticas");
    }

    const result = await response.json();
    return result.data;
  },
};
