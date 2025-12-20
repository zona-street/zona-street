import { Product, ListProductsQuery } from "../models/product.model";
import { ProductRepository } from "../repositories/product.repository";

/**
 * ProductService
 * 
 * Camada de lógica de negócio.
 * Responsável por orquestrar operações, aplicar regras de negócio
 * e validações antes de delegar ao Repository.
 */
export class ProductService {
  constructor(private repository: ProductRepository) {}

  /**
   * Lista produtos com filtros e validações
   */
  async listProducts(filters?: ListProductsQuery): Promise<{
    products: Product[];
    total: number;
  }> {
    // Validação de negócio: minPrice não pode ser maior que maxPrice
    if (
      filters?.minPrice !== undefined &&
      filters?.maxPrice !== undefined &&
      filters.minPrice > filters.maxPrice
    ) {
      throw new Error("Preço mínimo não pode ser maior que preço máximo");
    }

    const products = await this.repository.findAll(filters);
    const total = products.length;

    return {
      products,
      total,
    };
  }

  /**
   * Busca um produto por slug
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    const product = await this.repository.findBySlug(slug);

    if (!product) {
      return null;
    }

    // Aqui poderíamos adicionar lógica adicional, como:
    // - Incrementar contador de visualizações
    // - Registrar analytics
    // - Carregar dados relacionados

    return product;
  }

  /**
   * Busca um produto por ID
   */
  async getProductById(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }

  /**
   * Busca produtos em destaque
   */
  async getFeaturedProducts(): Promise<Product[]> {
    return this.repository.findFeatured();
  }

  /**
   * Busca novos drops
   */
  async getNewDrops(): Promise<Product[]> {
    return this.repository.findNewDrops();
  }

  /**
   * Verifica disponibilidade em estoque
   */
  async checkStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.repository.findById(productId);

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    return product.stock >= quantity;
  }

  /**
   * Calcula desconto percentual
   */
  calculateDiscount(product: Product): number | null {
    if (!product.oldPrice) {
      return null;
    }

    return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  }

  /**
   * Formata produto para resposta (pode incluir campos calculados)
   */
  formatProductResponse(product: Product): Product & { discount?: number | null } {
    return {
      ...product,
      discount: this.calculateDiscount(product),
    };
  }

  /**
   * Lista produtos formatados com campos adicionais
   */
  async listProductsFormatted(filters?: ListProductsQuery): Promise<{
    products: Array<Product & { discount?: number | null }>;
    total: number;
  }> {
    const { products, total } = await this.listProducts(filters);

    return {
      products: products.map((p) => this.formatProductResponse(p)),
      total,
    };
  }

  /**
   * Verifica se há produtos relacionados (mesma categoria)
   */
  async getRelatedProducts(slug: string, limit: number = 4): Promise<Product[]> {
    const product = await this.repository.findBySlug(slug);

    if (!product) {
      return [];
    }

    const relatedProducts = await this.repository.findByCategory(product.category);

    // Remove o produto atual e limita o resultado
    return relatedProducts
      .filter((p) => p.slug !== slug)
      .slice(0, limit);
  }
}

/**
 * Singleton instance
 */
import { productRepository } from "../repositories/product.repository";
export const productService = new ProductService(productRepository);
