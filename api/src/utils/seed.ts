import bcrypt from "bcryptjs";
import { db } from "../db";
import { users } from "../db/schema";
import { testConnection } from "../db";
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

  const email = "andrediniz@id.uff.br";
  const password = "zonastreet339";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [admin] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        role: "admin",
      })
      .returning();

    console.log("✅ Admin criado com sucesso!");
    console.log("📧 Email:", email);
    console.log("👤 ID:", admin.id);
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
