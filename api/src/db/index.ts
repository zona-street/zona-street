import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import "dotenv/config";

/**
 * Validação da DATABASE_URL
 */
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não está definida. Configure o arquivo .env com a URL de conexão do PostgreSQL."
  );
}

/**
 * Cliente PostgreSQL
 * Configuração otimizada para conexões em desenvolvimento e produção
 */
const connectionString = process.env.DATABASE_URL;

// Cliente de query (para operações normais)
const queryClient = postgres(connectionString, {
  max: 10, // Máximo de conexões no pool
  idle_timeout: 20, // Timeout de conexões ociosas (segundos)
  connect_timeout: 10, // Timeout de conexão (segundos)
});

// Cliente de migração (para operações DDL)
export const migrationClient = postgres(connectionString, {
  max: 1,
});

/**
 * Instância do Drizzle ORM
 * Configurada com o schema para type-safety completo
 */
export const db = drizzle(queryClient, { schema });

/**
 * Teste de conexão
 */
export async function testConnection(): Promise<boolean> {
  try {
    await queryClient`SELECT 1`;
    console.log("✅ Conexão com PostgreSQL estabelecida!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar ao PostgreSQL:", error);
    return false;
  }
}

/**
 * Fecha as conexões (útil para testes e shutdown graceful)
 */
export async function closeConnection(): Promise<void> {
  await queryClient.end();
  await migrationClient.end();
}
