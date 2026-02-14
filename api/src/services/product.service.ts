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
    const product = await this.repository.findBySlug(slug, false);

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
    return this.repository.findById(id, false);
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

    return Math.round(
      ((product.oldPrice - product.price) / product.oldPrice) * 100,
    );
  }

  /**
   * Formata produto para resposta (pode incluir campos calculados)
   */
  formatProductResponse(
    product: Product,
  ): Product & { discount?: number | null } {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      images: product.images,
      category: product.category,
      stock: product.stock,
      slug: product.slug,
      sizes: product.sizes,
      isNewDrop: product.isNewDrop,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
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
  async getRelatedProducts(
    slug: string,
    limit: number = 4,
  ): Promise<Product[]> {
    const product = await this.repository.findBySlug(slug);

    if (!product) {
      return [];
    }

    const relatedProducts = await this.repository.findByCategory(
      product.category,
    );

    // Remove o produto atual e limita o resultado
    return relatedProducts.filter((p) => p.slug !== slug).slice(0, limit);
  }

  /**
   * Cria um novo produto
   */
  async createProduct(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ): Promise<Product> {
    // Valida se o slug já existe
    const existingProduct = await this.repository.findBySlug(
      productData.slug,
      true,
    );
    if (existingProduct) {
      throw new Error("Já existe um produto com este slug");
    }

    // Valida preços
    if (productData.price <= 0) {
      throw new Error("Preço deve ser maior que zero");
    }

    if (productData.oldPrice && productData.oldPrice <= productData.price) {
      throw new Error("Preço antigo deve ser maior que o preço atual");
    }

    return this.repository.create(productData);
  }

  /**
   * Atualiza um produto existente
   */
  async updateProduct(
    id: string,
    productData: Partial<Product>,
  ): Promise<Product | null> {
    // Valida se o produto existe
    const existingProduct = await this.repository.findById(id, true);
    if (!existingProduct) {
      return null;
    }

    // Se estiver atualizando o slug, valida se já existe outro produto com o mesmo slug
    if (productData.slug && productData.slug !== existingProduct.slug) {
      const productWithSlug = await this.repository.findBySlug(
        productData.slug,
        true,
      );
      if (productWithSlug && productWithSlug.id !== id) {
        throw new Error("Já existe um produto com este slug");
      }
    }

    // Valida preços
    if (productData.price !== undefined && productData.price <= 0) {
      throw new Error("Preço deve ser maior que zero");
    }

    if (
      productData.oldPrice &&
      productData.price &&
      productData.oldPrice <= productData.price
    ) {
      throw new Error("Preço antigo deve ser maior que o preço atual");
    }

    return this.repository.update(id, productData);
  }

  /**
   * Deleta um produto
   */
  async deleteProduct(id: string): Promise<boolean> {
    // Verifica se o produto existe
    const existingProduct = await this.repository.findById(id, true);
    if (!existingProduct) {
      return false;
    }

    const hasOrderItems = await this.repository.hasOrderItems(id);
    if (hasOrderItems) {
      const error = new Error(
        "Produto possui pedidos associados e nao pode ser deletado",
      );
      (error as { statusCode?: number }).statusCode = 409;
      throw error;
    }

    return this.repository.delete(id);
  }

  /**
   * Arquiva um produto (desativa e zera estoque)
   */
  async archiveProduct(id: string): Promise<Product | null> {
    const existingProduct = await this.repository.findById(id, true);
    if (!existingProduct) {
      return null;
    }

    if (!existingProduct.isActive && existingProduct.stock === 0) {
      return existingProduct;
    }

    return this.repository.update(id, { isActive: false, stock: 0 });
  }

  /**
   * Reativa um produto
   */
  async restoreProduct(id: string): Promise<Product | null> {
    const existingProduct = await this.repository.findById(id, true);
    if (!existingProduct) {
      return null;
    }

    if (existingProduct.isActive) {
      return existingProduct;
    }

    return this.repository.update(id, { isActive: true });
  }
}

/**
 * Singleton instance
 */
import { productRepository } from "../repositories/product.repository";
export const productService = new ProductService(productRepository);
