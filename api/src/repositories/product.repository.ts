import { Product, ProductCategory, ListProductsQuery } from "../models/product.model";

/**
 * ProductRepository
 * 
 * Camada de acesso a dados utilizando Repository Pattern.
 * Atualmente utiliza um array em memória, mas está preparado
 * para ser facilmente migrado para um banco de dados real.
 * 
 * Padrão: Todas as operações retornam Promises para facilitar
 * a migração futura para operações assíncronas de BD.
 */
export class ProductRepository {
  private products: Product[] = [];

  /**
   * Seed inicial - será substituído pelo banco de dados
   */
  constructor(initialProducts: Product[] = []) {
    this.products = initialProducts;
  }

  /**
   * Lista todos os produtos com filtros opcionais
   */
  async findAll(filters?: ListProductsQuery): Promise<Product[]> {
    let filteredProducts = [...this.products];

    if (filters?.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filters.category
      );
    }

    if (filters?.isNewDrop !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.isNewDrop === filters.isNewDrop
      );
    }

    if (filters?.isFeatured !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.isFeatured === filters.isFeatured
      );
    }

    if (filters?.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= filters.minPrice!
      );
    }

    if (filters?.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= filters.maxPrice!
      );
    }

    // Ordenar por data de criação (mais recentes primeiro)
    return filteredProducts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  /**
   * Busca um produto por ID
   */
  async findById(id: string): Promise<Product | null> {
    const product = this.products.find((p) => p.id === id);
    return product || null;
  }

  /**
   * Busca um produto por slug (para URLs amigáveis)
   */
  async findBySlug(slug: string): Promise<Product | null> {
    const product = this.products.find((p) => p.slug === slug);
    return product || null;
  }

  /**
   * Cria um novo produto
   */
  async create(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }

  /**
   * Atualiza um produto existente
   */
  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex((p) => p.id === id);
    
    if (index === -1) {
      return null;
    }

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date(),
    };

    return this.products[index];
  }

  /**
   * Remove um produto
   */
  async delete(id: string): Promise<boolean> {
    const index = this.products.findIndex((p) => p.id === id);
    
    if (index === -1) {
      return false;
    }

    this.products.splice(index, 1);
    return true;
  }

  /**
   * Busca produtos por categoria
   */
  async findByCategory(category: ProductCategory): Promise<Product[]> {
    return this.products.filter((p) => p.category === category);
  }

  /**
   * Busca produtos em destaque
   */
  async findFeatured(): Promise<Product[]> {
    return this.products.filter((p) => p.isFeatured);
  }

  /**
   * Busca novos drops
   */
  async findNewDrops(): Promise<Product[]> {
    return this.products.filter((p) => p.isNewDrop);
  }

  /**
   * Verifica se um slug já existe
   */
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    return this.products.some(
      (p) => p.slug === slug && p.id !== excludeId
    );
  }

  /**
   * Conta total de produtos
   */
  async count(filters?: ListProductsQuery): Promise<number> {
    const filtered = await this.findAll(filters);
    return filtered.length;
  }

  /**
   * Limpa todos os produtos (útil para testes)
   */
  async clear(): Promise<void> {
    this.products = [];
  }

  /**
   * Adiciona múltiplos produtos (seed)
   */
  async seedProducts(products: Product[]): Promise<void> {
    this.products = [...this.products, ...products];
  }
}

/**
 * Singleton instance - facilita o uso em toda a aplicação
 * Em produção, isso seria gerenciado por um DI container
 */
export const productRepository = new ProductRepository();
