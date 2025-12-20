import { eq, and, gte, lte, desc } from "drizzle-orm";
import { db } from "../db";
import { products, type Product as DbProduct, type NewProduct } from "../db/schema";
import { Product, ProductCategory, ListProductsQuery } from "../models/product.model";

/**
 * ProductRepository - Refatorado com Drizzle ORM
 * 
 * Camada de acesso a dados utilizando Repository Pattern.
 * Implementado com Drizzle ORM para PostgreSQL.
 * 
 * Todas as operações são assíncronas e utilizam queries SQL
 * type-safe através do Drizzle.
 */
export class ProductRepository {
  /**
   * Converte produto do banco para modelo da aplicação
   */
  private toModel(dbProduct: DbProduct): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      description: dbProduct.description,
      price: parseFloat(dbProduct.price),
      oldPrice: dbProduct.oldPrice ? parseFloat(dbProduct.oldPrice) : undefined,
      images: dbProduct.images,
      category: dbProduct.category as ProductCategory,
      stock: parseInt(dbProduct.stock),
      slug: dbProduct.slug,
      sizes: dbProduct.sizes as any[],
      isNewDrop: dbProduct.isNewDrop,
      isFeatured: dbProduct.isFeatured,
      createdAt: dbProduct.createdAt,
      updatedAt: dbProduct.updatedAt,
    };
  }

  /**
   * Lista todos os produtos com filtros opcionais
   */
  async findAll(filters?: ListProductsQuery): Promise<Product[]> {
    const conditions = [];

    if (filters?.category) {
      conditions.push(eq(products.category, filters.category));
    }

    if (filters?.isNewDrop !== undefined) {
      conditions.push(eq(products.isNewDrop, filters.isNewDrop));
    }

    if (filters?.isFeatured !== undefined) {
      conditions.push(eq(products.isFeatured, filters.isFeatured));
    }

    if (filters?.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice.toString()));
    }

    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice.toString()));
    }

    const query = conditions.length > 0
      ? db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt))
      : db.select().from(products).orderBy(desc(products.createdAt));

    const results = await query;
    return results.map(this.toModel);
  }

  /**
   * Busca um produto por ID
   */
  async findById(id: string): Promise<Product | null> {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    return result[0] ? this.toModel(result[0]) : null;
  }

  /**
   * Busca um produto por slug (para URLs amigáveis)
   */
  async findBySlug(slug: string): Promise<Product | null> {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    return result[0] ? this.toModel(result[0]) : null;
  }

  /**
   * Cria um novo produto
   */
  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const newProduct: NewProduct = {
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString(),
      images: product.images,
      category: product.category,
      stock: product.stock.toString(),
      slug: product.slug,
      sizes: product.sizes as string[],
      isNewDrop: product.isNewDrop,
      isFeatured: product.isFeatured,
    };

    const result = await db
      .insert(products)
      .values(newProduct)
      .returning();

    return this.toModel(result[0]);
  }

  /**
   * Atualiza um produto existente
   */
  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const updateData: Partial<NewProduct> = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.description) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price.toString();
    if (updates.oldPrice !== undefined) updateData.oldPrice = updates.oldPrice?.toString();
    if (updates.images) updateData.images = updates.images;
    if (updates.category) updateData.category = updates.category;
    if (updates.stock !== undefined) updateData.stock = updates.stock.toString();
    if (updates.slug) updateData.slug = updates.slug;
    if (updates.sizes) updateData.sizes = updates.sizes as string[];
    if (updates.isNewDrop !== undefined) updateData.isNewDrop = updates.isNewDrop;
    if (updates.isFeatured !== undefined) updateData.isFeatured = updates.isFeatured;

    const result = await db
      .update(products)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return result[0] ? this.toModel(result[0]) : null;
  }

  /**
   * Remove um produto
   */
  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    return result.length > 0;
  }

  /**
   * Busca produtos por categoria
   */
  async findByCategory(category: ProductCategory): Promise<Product[]> {
    const results = await db
      .select()
      .from(products)
      .where(eq(products.category, category))
      .orderBy(desc(products.createdAt));

    return results.map(this.toModel);
  }

  /**
   * Busca produtos em destaque
   */
  async findFeatured(): Promise<Product[]> {
    const results = await db
      .select()
      .from(products)
      .where(eq(products.isFeatured, true))
      .orderBy(desc(products.createdAt));

    return results.map(this.toModel);
  }

  /**
   * Busca novos drops
   */
  async findNewDrops(): Promise<Product[]> {
    const results = await db
      .select()
      .from(products)
      .where(eq(products.isNewDrop, true))
      .orderBy(desc(products.createdAt));

    return results.map(this.toModel);
  }

  /**
   * Verifica se um slug já existe
   */
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (result.length === 0) return false;
    if (excludeId && result[0].id === excludeId) return false;

    return true;
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
    await db.delete(products);
  }

  /**
   * Adiciona múltiplos produtos (seed)
   */
  async seedProducts(productsData: Array<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    if (productsData.length === 0) return;

    const newProducts: NewProduct[] = productsData.map(p => ({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      oldPrice: p.oldPrice?.toString(),
      images: p.images,
      category: p.category,
      stock: p.stock.toString(),
      slug: p.slug,
      sizes: p.sizes as string[],
      isNewDrop: p.isNewDrop,
      isFeatured: p.isFeatured,
    }));

    await db.insert(products).values(newProducts);
  }
}

/**
 * Singleton instance - facilita o uso em toda a aplicação
 * Em produção, isso seria gerenciado por um DI container
 */
export const productRepository = new ProductRepository();
