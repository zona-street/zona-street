export const PRODUCT_CATEGORIES = [
  "camisetas",
  "moletons",
  "calcas",
  "jaquetas",
  "acessorios",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_SIZES = ["PP", "P", "M", "G", "GG", "XG", "XXG"] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];
