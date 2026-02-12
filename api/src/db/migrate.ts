import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { migrationClient } from "./index";
import * as schema from "./schema";
import "dotenv/config";

/**
 * Script de migração do banco de dados
 * Execute: npm run db:migrate
 */
async function runMigrations() {
  console.log("🚀 Iniciando migrações do banco de dados...");

  try {
    const db = drizzle(migrationClient, { schema });

    await migrate(db, {
      migrationsFolder: "./drizzle",
    });

    console.log("✅ Migrações executadas com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao executar migrações:", error);
    process.exit(1);
  }
}

runMigrations();
