import { ProductCategory, ProductSize } from "../models/product.model";
import { productRepository } from "../repositories/product.repository";
import { testConnection } from "../db";
import "dotenv/config";

/**
 * Produtos iniciais com estética Neobrutalista/Streetwear
 * Inspirados na identidade visual do Zona Street
 */
const mockProducts = [
  {
    name: "Moletom Oversized Número 4",
    description:
      "Moletom oversized inspirado no icônico Número 4 do KND. Confeccionado em moletom premium de 350g/m², com corte amplo e caimento perfeito. Estampa em silk screen de alta durabilidade. Essencial para quem vive a cultura streetwear com autenticidade.",
    price: 249.9,
    oldPrice: 349.9,
    images: [
      "/products/featured/moletom-numero-4-front.png",
      "/products/featured/moletom-numero-4-back.png",
      "/products/featured/moletom-numero-4-detail.png",
    ],
    category: ProductCategory.MOLETONS,
    stock: 45,
    slug: "moletom-oversized-numero-4",
    sizes: [ProductSize.M, ProductSize.G, ProductSize.GG, ProductSize.XG, ProductSize.XXG],
    isNewDrop: false,
    isFeatured: true,
  },
  {
    name: "Camiseta Streetwear Y2K",
    description:
      "Camiseta oversized com gráficos vibrantes inspirados na estética Y2K dos anos 2000. Tecido 100% algodão penteado, gramatura 180g/m². Cores contrastantes e bordas marcadas que traduzem a essência neobrutalista. Perfeita para criar combos autênticos.",
    price: 129.9,
    oldPrice: 179.9,
    images: [
      "/products/camiseta-y2k-laranja.png",
      "/products/camiseta-y2k-azul.png",
      "/products/camiseta-y2k-styled.png",
    ],
    category: ProductCategory.CAMISETAS,
    stock: 78,
    slug: "camiseta-streetwear-y2k",
    sizes: [ProductSize.P, ProductSize.M, ProductSize.G, ProductSize.GG, ProductSize.XG],
    isNewDrop: true,
    isFeatured: false,
  },
  {
    name: "Calça Cargo Oversized Preta",
    description:
      "Calça cargo oversized com múltiplos bolsos utilitários. Tecido misto de alta resistência com elastano para conforto máximo. Ajuste na cintura e barra. Design funcional que une streetwear e praticidade urbana. Disponível em preto absoluto.",
    price: 299.9,
    images: [
      "/products/calca-cargo-black.png",
      "/products/calca-cargo-detail.png",
      "/products/calca-cargo-pocket.png",
    ],
    category: ProductCategory.CALCAS,
    stock: 32,
    slug: "calca-cargo-oversized-preta",
    sizes: [ProductSize.P, ProductSize.M, ProductSize.G, ProductSize.GG],
    isNewDrop: true,
    isFeatured: false,
  },
  {
    name: "Jaqueta Bomber Zona Street",
    description:
      "Jaqueta bomber com branding exclusivo Zona Street. Nylon de alta qualidade com forro interno, bolsos frontais e punhos ribana. Patches bordados com as cores laranja e azul royal da marca. Statement piece para completar qualquer look streetwear.",
    price: 399.9,
    oldPrice: 549.9,
    images: [
      "/products/jaqueta-bomber-front.png",
      "/products/jaqueta-bomber-back.png",
      "/products/jaqueta-bomber-patch.png",
    ],
    category: ProductCategory.JAQUETAS,
    stock: 18,
    slug: "jaqueta-bomber-zona-street",
    sizes: [ProductSize.M, ProductSize.G, ProductSize.GG, ProductSize.XG],
    isNewDrop: false,
    isFeatured: false,
  },
  {
    name: "Camiseta Oversized Básica Off-White",
    description:
      "Camiseta oversized básica na cor off-white, perfeita para compor looks do dia a dia. Tecido premium 100% algodão penteado 200g/m², corte amplo e costuras reforçadas. Um essencial no guarda-roupa de quem curte o estilo clean e confortável.",
    price: 99.9,
    images: [
      "/products/camiseta-oversized-offwhite.png",
      "/products/camiseta-oversized-fit.png",
    ],
    category: ProductCategory.CAMISETAS,
    stock: 120,
    slug: "camiseta-oversized-basica-off-white",
    sizes: [
      ProductSize.PP,
      ProductSize.P,
      ProductSize.M,
      ProductSize.G,
      ProductSize.GG,
      ProductSize.XG,
    ],
    isNewDrop: false,
    isFeatured: false,
  },
];

/**
 * Função de seed para popular o banco de dados
 */
export async function seedProducts(): Promise<void> {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Testa conexão
  const connected = await testConnection();
  if (!connected) {
    throw new Error("Não foi possível conectar ao banco de dados");
  }

  // Limpa produtos existentes (útil em desenvolvimento)
  console.log("🗑️  Limpando produtos existentes...");
  await productRepository.clear();

  // Adiciona os produtos mock
  console.log("📦 Inserindo produtos no banco...");
  await productRepository.seedProducts(mockProducts);

  console.log(`✨ ${mockProducts.length} produtos adicionados ao catálogo`);
}

/**
 * Execução direta do script (quando rodar npm run seed)
 */
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log("🎉 Seed concluído com sucesso!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erro ao executar seed:", error);
      process.exit(1);
    });
}
