import { FastifyInstance } from "fastify";
import { productController } from "../controllers/product.controller";

/**
 * Rotas de produtos
 */
export async function productRoutes(fastify: FastifyInstance) {
  // Rotas especiais devem vir antes das rotas parametrizadas
  fastify.get("/featured", {
    schema: {
      description: "Lista produtos em destaque",
      tags: ["products"],
      response: {
        200: {
          description: "Produtos em destaque retornados com sucesso",
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "array" },
            meta: { type: "object" },
          },
        },
      },
    },
    handler: productController.getFeaturedProducts.bind(productController),
  });

  fastify.get("/new-drops", {
    schema: {
      description: "Lista novos lançamentos",
      tags: ["products"],
      response: {
        200: {
          description: "Novos drops retornados com sucesso",
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "array" },
            meta: { type: "object" },
          },
        },
      },
    },
    handler: productController.getNewDrops.bind(productController),
  });

  // Rota de listagem com filtros
  fastify.get("/", {
    schema: {
      description: "Lista todos os produtos com filtros opcionais",
      tags: ["products"],
      querystring: {
        type: "object",
        properties: {
          category: { type: "string" },
          isNewDrop: { type: "boolean" },
          isFeatured: { type: "boolean" },
          minPrice: { type: "number" },
          maxPrice: { type: "number" },
        },
      },
      response: {
        200: {
          description: "Produtos retornados com sucesso",
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "array" },
            meta: { type: "object" },
          },
        },
      },
    },
    handler: productController.listProducts.bind(productController),
  });

  // Rota parametrizada (deve vir por último)
  fastify.get("/:slug", {
    schema: {
      description: "Busca um produto por slug",
      tags: ["products"],
      params: {
        type: "object",
        properties: {
          slug: { type: "string" },
        },
        required: ["slug"],
      },
      response: {
        200: {
          description: "Produto encontrado com sucesso",
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "object" },
          },
        },
        404: {
          description: "Produto não encontrado",
          type: "object",
          properties: {
            success: { type: "boolean" },
            error: { type: "string" },
          },
        },
      },
    },
    handler: productController.getProductBySlug.bind(productController),
  });
}
