export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: "camisetas" | "moletons" | "calcas" | "acessorios" | "calcados";
  stock: number;
  slug: string;
  sizes: string[];
  isNewDrop: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
