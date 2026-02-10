import { Resend } from "resend";
import * as dotenv from "dotenv";

// Carrega variáveis de ambiente
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log("🧪 Testando Resend API...\n");

  console.log(`🔑 API Key: ${process.env.RESEND_API_KEY?.substring(0, 10)}...`);
  console.log(`📧 From Email: onboarding@resend.dev`);
  console.log(`📬 To Email: delivered@resend.dev (email de teste)\n`);

  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "delivered@resend.dev", // Email de teste do Resend
      subject: "Teste - Zona Street",
      html: "<h1>Email de teste funcionou! 🎉</h1><p>Seu Resend está configurado corretamente.</p>",
    });

    console.log("✅ Email enviado com sucesso!");
    console.log("📊 Resultado:", JSON.stringify(result, null, 2));
    console.log("\n🎉 Resend configurado corretamente!");
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
  }
}

testResend();
