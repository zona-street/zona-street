-- Add optional subcategory column to products
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "subcategory" TEXT;

-- Convert category column from PostgreSQL enum to plain TEXT.
-- This preserves all existing product data while allowing new category values
-- to be stored without an enum constraint.
ALTER TABLE "products" ALTER COLUMN "category" TYPE text;

-- Drop old category enum type (no longer used by the products table)
DROP TYPE IF EXISTS "category";
