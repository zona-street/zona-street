import { Product } from "@/lib/types/product";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1";

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: "camisetas" | "moletons" | "calcas" | "acessorios" | "calcados";
  stock: number;
  slug: string;
  sizes: string[];
  isNewDrop?: boolean;
  isFeatured?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductFilters {
  category?: string;
  page?: number;
  limit?: number;
}

export const productsApi = {
  // Buscar todos os produtos (com filtros opcionais)
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append("category", filters.category);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const url = `${API_URL}/products${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url, {
        next: { revalidate: 3600 }, // ISR: revalidar a cada 1 hora
      });

      if (!response.ok) {
        console.error("Erro ao buscar produtos:", response.statusText);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  },

  // Buscar produtos em destaque
  async getFeatured(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products/featured`, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        console.error(
          "Erro ao buscar produtos em destaque:",
          response.statusText
        );
        return [];
      }

      const data = await response.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch (error) {
      console.error("Erro ao buscar produtos em destaque:", error);
      return [];
    }
  },

  // Buscar novos lançamentos
  async getNewDrops(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products/new-drops`, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        console.error("Erro ao buscar novos lançamentos:", response.statusText);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch (error) {
      console.error("Erro ao buscar novos lançamentos:", error);
      return [];
    }
  },

  // Buscar produto por slug
  async getBySlug(slug: string): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar produto");
    }

    const data = await response.json();
    return data.data;
  },

  // Criar produto (Admin)
  async create(
    productData: CreateProductData,
    token: string
  ): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao criar produto");
    }

    const data = await response.json();
    return data.data;
  },

  // Atualizar produto (Admin)
  async update(
    id: string,
    productData: UpdateProductData,
    token: string
  ): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao atualizar produto");
    }

    const data = await response.json();
    return data.data;
  },

  // Deletar produto (Admin)
  async delete(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao deletar produto");
    }
  },
};
