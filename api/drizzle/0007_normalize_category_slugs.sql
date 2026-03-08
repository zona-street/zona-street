-- Normalize category slugs to plural form for consistency
UPDATE "products" SET "category" = 'bermudas' WHERE "category" = 'bermuda';
UPDATE "products" SET "category" = 'calcas' WHERE "category" = 'calca';
