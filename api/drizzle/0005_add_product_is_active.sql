-- Adiciona flag de ativo/inativo aos produtos
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "is_active" boolean NOT NULL DEFAULT true;
