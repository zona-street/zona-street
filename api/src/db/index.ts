import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "./schema";
import "dotenv/config";

/**
 * Validação da DATABASE_URL
 */
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não está definida. Configure o arquivo .env com a URL de conexão do Neon PostgreSQL."
  );
}

/**
 * Configuração do Neon para desenvolvimento local
 * Em produção (Vercel/Cloudflare), o WebSocket nativo é usado automaticamente
 */
if (process.env.NODE_ENV === "development") {
  neonConfig.webSocketConstructor = ws;
}

/**
 * Pool de conexões Neon Serverless
 * Otimizado para serverless environments com conexões efêmeras
 */
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Instância do Drizzle ORM
 * Configurada com o schema para type-safety completo
 */
export const db = drizzle(pool, { schema });

/**
 * Pool de conexões para migrações
 * Utiliza a mesma pool principal
 */
export const migrationClient = pool;

/**
 * Teste de conexão
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await pool.query("SELECT 1");
    console.log("✅ Conexão com Neon PostgreSQL estabelecida!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar ao Neon PostgreSQL:", error);
    return false;
  }
}

/**
 * Fecha as conexões (útil para testes e shutdown graceful)
 */
export async function closeConnection(): Promise<void> {
  await pool.end();
}
