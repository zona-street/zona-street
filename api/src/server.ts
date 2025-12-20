import { buildApp } from "./app";
import { config } from "./config/app.config";
import { seedProducts } from "./utils/seed";

/**
 * Inicia o servidor
 */
async function start() {
  try {
    const app = await buildApp();

    // Seed inicial de produtos (apenas em desenvolvimento)
    if (config.isDevelopment) {
      console.log("🌱 Carregando produtos iniciais...");
      await seedProducts();
      console.log("✅ Produtos carregados com sucesso!");
    }

    // Inicia o servidor
    await app.listen({ port: config.port, host: config.host });

    console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║           🔥 ZONA STREET API 🔥                   ║
║                                                   ║
║   Servidor rodando em:                            ║
║   http://${config.host}:${config.port}                          ║
║                                                   ║
║   Documentação:                                   ║
║   http://${config.host}:${config.port}${config.apiPrefix}/products      ║
║                                                   ║
║   Ambiente: ${config.env.toUpperCase().padEnd(35)}  ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `);
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

// Tratamento de sinais de shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Encerrando servidor...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Encerrando servidor...");
  process.exit(0);
});

// Inicia a aplicação
start();
