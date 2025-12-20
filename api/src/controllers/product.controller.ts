import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/product.service";
import {
  listProductsQuerySchema,
  productSlugParamsSchema,
  ListProductsQuery,
  ProductSlugParams,
} from "../models/product.model";

/**
 * ProductController
 * 
 * Camada de apresentação (Controllers/Handlers).
 * Responsável por lidar com requisições HTTP, validar inputs,
 * chamar services e formatar respostas.
 */
export class ProductController {
  constructor(private service: ProductService) {}

  /**
   * GET /products
   * Lista todos os produtos com filtros opcionais
   */
  async listProducts(
    request: FastifyRequest<{ Querystring: ListProductsQuery }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      // Validação com Zod
      const filters = listProductsQuerySchema.parse(request.query);

      const result = await this.service.listProductsFormatted(filters);

      reply.status(200).send({
        success: true,
        data: result.products,
        meta: {
          total: result.total,
          filters: filters,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        reply.status(400).send({
          success: false,
          error: error.message,
        });
      } else {
        reply.status(500).send({
          success: false,
          error: "Erro interno do servidor",
        });
      }
    }
  }

  /**
   * GET /products/:slug
   * Busca um produto específico por slug
   */
  async getProductBySlug(
    request: FastifyRequest<{ Params: ProductSlugParams }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      // Validação com Zod
      const { slug } = productSlugParamsSchema.parse(request.params);

      const product = await this.service.getProductBySlug(slug);

      if (!product) {
        reply.status(404).send({
          success: false,
          error: "Produto não encontrado",
        });
        return;
      }

      // Buscar produtos relacionados
      const relatedProducts = await this.service.getRelatedProducts(slug);

      reply.status(200).send({
        success: true,
        data: {
          ...this.service.formatProductResponse(product),
          relatedProducts: relatedProducts.map((p) =>
            this.service.formatProductResponse(p)
          ),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        reply.status(400).send({
          success: false,
          error: error.message,
        });
      } else {
        reply.status(500).send({
          success: false,
          error: "Erro interno do servidor",
        });
      }
    }
  }

  /**
   * GET /products/featured
   * Lista produtos em destaque
   */
  async getFeaturedProducts(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const products = await this.service.getFeaturedProducts();

      reply.status(200).send({
        success: true,
        data: products.map((p) => this.service.formatProductResponse(p)),
        meta: {
          total: products.length,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        reply.status(500).send({
          success: false,
          error: error.message,
        });
      } else {
        reply.status(500).send({
          success: false,
          error: "Erro interno do servidor",
        });
      }
    }
  }

  /**
   * GET /products/new-drops
   * Lista novos lançamentos
   */
  async getNewDrops(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const products = await this.service.getNewDrops();

      reply.status(200).send({
        success: true,
        data: products.map((p) => this.service.formatProductResponse(p)),
        meta: {
          total: products.length,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        reply.status(500).send({
          success: false,
          error: error.message,
        });
      } else {
        reply.status(500).send({
          success: false,
          error: "Erro interno do servidor",
        });
      }
    }
  }
}

/**
 * Singleton instance
 */
import { productService } from "../services/product.service";
export const productController = new ProductController(productService);
