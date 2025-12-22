import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/product.service";
import { SubscriberService } from "../services/subscriber.service";
import { EmailService } from "../services/email.service";
import {
  listProductsQuerySchema,
  productSlugParamsSchema,
  ListProductsQuery,
  ProductSlugParams,
  ProductCategory,
  ProductSize,
} from "../models/product.model";
import { z } from "zod";

/**
 * ProductController
 *
 * Camada de apresentação (Controllers/Handlers).
 * Responsável por lidar com requisições HTTP, validar inputs,
 * chamar services e formatar respostas.
 */
export class ProductController {
  private subscriberService: SubscriberService;
  private emailService: EmailService;

  constructor(private service: ProductService) {
    this.subscriberService = new SubscriberService();
    this.emailService = new EmailService();
  }

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

      console.log("📋 Listagem de produtos:", {
        total: result.total,
        quantidade: result.products.length,
      });

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

      // Retornar apenas o produto (frontend busca relacionados separadamente)
      reply.status(200).send({
        success: true,
        data: this.service.formatProductResponse(product),
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

  /**
   * POST /products - Cria um novo produto (Admin)
   */
  async createProduct(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const createProductSchema = z.object({
        name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
        description: z
          .string()
          .min(10, "Descrição deve ter no mínimo 10 caracteres"),
        price: z.coerce.number().positive("Preço deve ser positivo"),
        oldPrice: z.coerce.number().positive().optional(),
        category: z.nativeEnum(ProductCategory),
        slug: z.string().min(3, "Slug inválido"),
        images: z.array(z.string()).min(1, "Adicione pelo menos uma imagem"),
        sizes: z
          .array(z.nativeEnum(ProductSize))
          .min(1, "Adicione pelo menos um tamanho"),
        stock: z.coerce.number().int().nonnegative().default(0),
        isNewDrop: z.coerce.boolean().default(false),
        isFeatured: z.coerce.boolean().default(false),
      });

      const data = createProductSchema.parse(request.body);

      const product = await this.service.createProduct(data);

      // Se for um novo lançamento, dispara emails para assinantes
      if (data.isNewDrop) {
        const subscribers = await this.subscriberService.getAllSubscribers();

        if (subscribers.length > 0) {
          const emails = subscribers.map((sub) => sub.email);

          // Dispara emails de forma assíncrona (não bloqueia a resposta)
          this.emailService
            .sendBulkNewProductEmails(emails, {
              productName: product.name,
              productDescription: product.description,
              productPrice: Number(product.price),
              productImage: product.images[0],
              productSlug: product.slug,
            })
            .catch((error) => {
              console.error("Erro ao enviar emails:", error);
            });
        }
      }

      reply.status(201).send({
        success: true,
        data: this.service.formatProductResponse(product),
        message: "Produto criado com sucesso",
      });
    } catch (error) {
      console.error("❌ Erro ao criar produto:", error);
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          success: false,
          error: "Dados inválidos",
          details: error.errors,
        });
      } else if (error instanceof Error) {
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
   * PUT /products/:id - Atualiza um produto (Admin)
   */
  async updateProduct(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;

      const updateProductSchema = z.object({
        name: z.string().min(3).optional(),
        description: z.string().min(10).optional(),
        price: z.number().positive().optional(),
        oldPrice: z.number().positive().optional(),
        category: z.nativeEnum(ProductCategory).optional(),
        slug: z.string().min(3).optional(),
        images: z.array(z.string()).min(1).optional(),
        sizes: z.array(z.nativeEnum(ProductSize)).min(1).optional(),
        stock: z.number().int().nonnegative().optional(),
        isNewDrop: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      });

      const data = updateProductSchema.parse(request.body);

      const product = await this.service.updateProduct(id, data);

      if (!product) {
        reply.status(404).send({
          success: false,
          error: "Produto não encontrado",
        });
        return;
      }

      reply.send({
        success: true,
        data: this.service.formatProductResponse(product),
        message: "Produto atualizado com sucesso",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          success: false,
          error: "Dados inválidos",
          details: error.errors,
        });
      } else if (error instanceof Error) {
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
   * DELETE /products/:id - Deleta um produto (Admin)
   */
  async deleteProduct(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;

      const deleted = await this.service.deleteProduct(id);

      if (!deleted) {
        reply.status(404).send({
          success: false,
          error: "Produto não encontrado",
        });
        return;
      }

      reply.send({
        success: true,
        message: "Produto deletado com sucesso",
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
