/**
 * Script para criar o primeiro usuário admin
 * Execute: tsx src/utils/create-admin.ts
 */
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users } from "../db/schema";

async function createAdmin() {
  console.log("🚀 Criando usuário admin...");

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
      console.log("ℹ️  Admin já existe!");
    } else {
      console.error("❌ Erro ao criar admin:", error);
    }
  }

  process.exit(0);
}

createAdmin();
