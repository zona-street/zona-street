/**
 * Script para criar o primeiro usuário admin
 * Execute: tsx src/utils/create-admin.ts
 */
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users } from "../db/schema";

async function createAdmin() {
  console.log("🚀 Criando usuário admin...");

  const email = "admin@zonastreet.com";
  const password = "admin123"; // Alterar em produção!
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
    console.log("🔑 Senha:", password);
    console.log("👤 ID:", admin.id);
    console.log("\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!");
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
