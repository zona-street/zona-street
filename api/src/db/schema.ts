import {
  pgTable,
  text,
  numeric,
  boolean,
  timestamp,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

/**
 * Enum para categorias de produtos
 */
export const categoryEnum = pgEnum("category", [
  "camisetas",
  "moletons",
  "calcas",
  "jaquetas",
  "acessorios",
]);

/**
 * Enum para tamanhos
 */
export const sizeEnum = pgEnum("size", [
  "PP",
  "P",
  "M",
  "G",
  "GG",
  "XG",
  "XXG",
]);

/**
 * Enum para roles de usuários
 */
export const roleEnum = pgEnum("role", ["admin", "customer"]);

/**
 * Enum para status de pedidos
 */
export const orderStatusEnum = pgEnum("order_status", [
  "PENDENTE",
  "CONCLUIDO",
  "CANCELADO",
]);

/**
 * Tabela de produtos
 */
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  oldPrice: numeric("old_price", { precision: 10, scale: 2 }),
  images: text("images").array().notNull(),
  category: categoryEnum("category").notNull(),
  stock: numeric("stock", { precision: 10, scale: 0 }).notNull().default("0"),
  slug: text("slug").notNull().unique(),
  sizes: text("sizes").array().notNull(), // Array de strings para tamanhos
  isNewDrop: boolean("is_new_drop").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Tabela de usuários
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Hashed com bcrypt
  role: roleEnum("role").notNull().default("customer"),
  resetTokenHash: text("reset_token_hash"), // Hash do token de reset de senha
  resetTokenExpiresAt: timestamp("reset_token_expires_at", { withTimezone: true }), // Expiração do token
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Tabela de assinantes da newsletter
 */
export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Tabela de pedidos
 */
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").notNull().default("PENDENTE"),
  notes: text("notes"), // Observações do admin
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  validatedAt: timestamp("validated_at", { withTimezone: true }), // Quando foi validado
});

/**
 * Tabela de itens do pedido
 */
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  productName: text("product_name").notNull(), // Snapshot do nome
  productPrice: numeric("product_price", { precision: 10, scale: 2 }).notNull(), // Snapshot do preço
  productImage: text("product_image").notNull(), // Snapshot da imagem
  size: text("size").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 0 })
    .notNull()
    .default("1"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
});

/**
 * Type inference para TypeScript
 */
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
