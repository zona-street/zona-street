import { z } from "zod";

/**
 * Categoria de produto
 */
export enum ProductCategory {
  CAMISETAS = "camisetas",
  MOLETONS = "moletons",
  CALCAS = "calcas",
  JAQUETAS = "jaquetas",
  ACESSORIOS = "acessorios",
}

/**
 * Tamanhos disponíveis
 */
export enum ProductSize {
  PP = "PP",
  P = "P",
  M = "M",
  G = "G",
  GG = "GG",
  XG = "XG",
  XXG = "XXG",
}

/**
 * Interface principal do Produto
 */
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
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema Zod para validação de criação de produto
 */
export const createProductSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  price: z.number().positive("Preço deve ser positivo"),
  oldPrice: z.number().positive().optional(),
  images: z
    .array(z.string().url())
    .min(1, "Produto deve ter ao menos 1 imagem"),
  category: z.nativeEnum(ProductCategory),
  stock: z.number().int().nonnegative("Estoque não pode ser negativo"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug deve estar em formato kebab-case"
    ),
  sizes: z
    .array(z.nativeEnum(ProductSize))
    .min(1, "Produto deve ter ao menos 1 tamanho"),
  isNewDrop: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

/**
 * Schema Zod para validação de atualização de produto
 */
export const updateProductSchema = createProductSchema.partial();

/**
 * Schema para query params de listagem
 */
export const listProductsQuerySchema = z.object({
  category: z.nativeEnum(ProductCategory).optional(),
  isNewDrop: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  includeInactive: z.coerce.boolean().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
});

/**
 * Schema para params de rota com slug
 */
export const productSlugParamsSchema = z.object({
  slug: z.string(),
});

/**
 * Type helpers
 */
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
export type ProductSlugParams = z.infer<typeof productSlugParamsSchema>;
