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
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Type inference para TypeScript
 */
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
