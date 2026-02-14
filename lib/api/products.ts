import { Product } from "@/lib/types/product";
import type { ProductCategory, ProductSize } from "@/lib/constants/product";
import { getApiUrl, fetchWithTimeout } from "@/lib/utils/api";

const API_URL = getApiUrl();

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: ProductCategory;
  stock: number;
  slug: string;
  sizes: ProductSize[];
  isNewDrop?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductFilters {
  category?: string;
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}

export const productsApi = {
  // Buscar todos os produtos (com filtros opcionais)
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append("category", filters.category);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.includeInactive) params.append("includeInactive", "true");

      const url = `${API_URL}/products${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url, {
        next: { revalidate: 60 }, // Revalidar a cada 1 minuto
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
          response.statusText,
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
  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const url = `${API_URL}/products/${slug}`;
      const response = await fetch(url, {
        next: { revalidate: 60 }, // Revalidar a cada 1 minuto
      });

      if (!response.ok) {
        console.error(`API error ${response.status}:`, await response.text());
        return null;
      }

      const text = await response.text();
      const data = JSON.parse(text);
      return data.data || null;
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      return null;
    }
  },

  // Criar produto (Admin)
  async create(
    productData: CreateProductData,
    token: string,
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
      const error = await response.json().catch(() => ({}));
      const message = error.error || error.message;
      throw new Error(message || "Erro ao criar produto");
    }

    const data = await response.json();
    return data.data;
  },

  // Atualizar produto (Admin)
  async update(
    id: string,
    productData: UpdateProductData,
    token: string,
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
      const error = await response.json().catch(() => ({}));
      const message = error.error || error.message;
      throw new Error(message || "Erro ao atualizar produto");
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
      const error = await response.json().catch(() => ({}));
      const message = error.error || error.message;
      throw new Error(message || "Erro ao deletar produto");
    }
  },

  // Arquivar produto (Admin)
  async archive(id: string, token: string): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}/archive`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message = error.error || error.message;
      throw new Error(message || "Erro ao arquivar produto");
    }

    const data = await response.json();
    return data.data;
  },

  // Reativar produto (Admin)
  async restore(id: string, token: string): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}/restore`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message = error.error || error.message;
      throw new Error(message || "Erro ao reativar produto");
    }

    const data = await response.json();
    return data.data;
  },
};
