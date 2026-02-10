import { sql } from "drizzle-orm";
import { db } from "./src/db/index";

async function checkSchema() {
  console.log("🔍 Verificando colunas da tabela users...\n");

  try {
    // Lista todas as colunas da tabela users
    const result = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log("📊 Colunas encontradas:");
    console.table(result.rows);

    const hasResetToken = result.rows.some(
      (row: any) => row.column_name === "reset_token_hash",
    );
    const hasResetExpires = result.rows.some(
      (row: any) => row.column_name === "reset_token_expires_at",
    );

    console.log("\n✅ Verificação:");
    console.log(
      `   reset_token_hash: ${hasResetToken ? "✅ EXISTE" : "❌ NÃO EXISTE"}`,
    );
    console.log(
      `   reset_token_expires_at: ${hasResetExpires ? "✅ EXISTE" : "❌ NÃO EXISTE"}`,
    );

    if (!hasResetToken || !hasResetExpires) {
      console.log("\n⚠️  As colunas de reset NÃO existem no banco!");
      console.log("💡 Vamos criar manualmente...");

      await db.execute(
        sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token_hash" text`,
      );
      await db.execute(
        sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token_expires_at" timestamp with time zone`,
      );

      console.log("✅ Colunas criadas com sucesso!");
    } else {
      console.log("\n✅ Todas as colunas necessárias existem!");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao verificar schema:", error);
    process.exit(1);
  }
}

checkSchema();
