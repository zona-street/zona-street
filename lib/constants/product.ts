export const PRODUCT_CATEGORIES = [
  "camisas",
  "casacos",
  "tenis",
  "bones",
  "bermudas",
  "calcas",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_SIZES = ["PP", "P", "M", "G", "GG", "XG", "XXG"] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  camisas: "Camisas",
  casacos: "Casacos",
  tenis: "Tênis",
  bones: "Bonés",
  bermudas: "Bermudas",
  calcas: "Calças",
};

export const SUBCATEGORIES: Record<
  ProductCategory,
  { value: string; label: string }[]
> = {
  camisas: [
    { value: "oversized", label: "Oversized" },
    { value: "oversized-basica", label: "Oversized Básica" },
    { value: "primeira-linha", label: "Primeira Linha" },
    { value: "camisa-time", label: "Camisa de Time" },
    { value: "dri-fit", label: "Dri Fit" },
  ],
  casacos: [
    { value: "moletom", label: "Moletom" },
    { value: "corta-vento", label: "Corta Vento" },
    { value: "casaco-ziper", label: "Casaco Zíper" },
  ],
  tenis: [],
  bones: [
    { value: "aba-curva", label: "Aba Curva" },
    { value: "aba-reta", label: "Aba Reta" },
    { value: "five-panel", label: "Five Panel" },
  ],
  bermudas: [
    { value: "dri-fit", label: "Dri Fit" },
    { value: "sarja", label: "Sarja" },
    { value: "cargo", label: "Cargo" },
  ],
  calcas: [
    { value: "jogger", label: "Jogger" },
    { value: "baggy-balao", label: "Baggy Balão" },
    { value: "dri-fit-elastano", label: "Dri Fit Elastano" },
  ],
};
