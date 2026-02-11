CREATE TYPE "public"."category" AS ENUM('camisetas', 'moletons', 'calcas', 'jaquetas', 'acessorios');--> statement-breakpoint
CREATE TYPE "public"."size" AS ENUM('PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"old_price" numeric(10, 2),
	"images" text[] NOT NULL,
	"category" "category" NOT NULL,
	"stock" numeric(10, 0) DEFAULT '0' NOT NULL,
	"slug" text NOT NULL,
	"sizes" text[] NOT NULL,
	"is_new_drop" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
