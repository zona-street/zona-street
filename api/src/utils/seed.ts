import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { db, testConnection } from "../db";
import "dotenv/config";

/**
 * Função de seed para criar apenas o usuário admin
 */
export async function seedAdmin(): Promise<void> {
  console.log("🌱 Iniciando seed do usuário admin...");

  // Testa conexão
  const connected = await testConnection();
  if (!connected) {
    throw new Error("Não foi possível conectar ao banco de dados");
  }

  const email = "soarescmpos@gmail.com";
  const password = "zonastreet339";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const insertResult = await db.execute(sql`
      INSERT INTO users (email, password, role)
      VALUES (${email}, ${hashedPassword}, 'admin')
      ON CONFLICT (email)
      DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role
      RETURNING id
    `);

    const adminId = insertResult.rows?.[0]?.id;

    console.log("✅ Admin criado com sucesso!");
    console.log("📧 Email:", email);
    console.log("👤 ID:", adminId);
  } catch (error: any) {
    if (error.code === "23505") {
      console.log("ℹ️  Admin já existe no banco!");
    } else {
      console.error("❌ Erro ao criar admin:", error);
      throw error;
    }
  }
}

/**
 * Execução direta do script (quando rodar npm run seed)
 */
if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log("🎉 Seed concluído com sucesso!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erro ao executar seed:", error);
      process.exit(1);
    });
}
