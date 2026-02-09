import type { ProductCategory, ProductSize } from "@/lib/constants/product";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: ProductCategory;
  stock: number;
  slug: string;
  sizes: ProductSize[];
  isNewDrop: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
