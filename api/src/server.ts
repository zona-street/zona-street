import { buildApp } from "./app";
import { config } from "./config/app.config";
import { testConnection } from "./db";
import "dotenv/config";

/**
 * Inicia o servidor
 */
async function start() {
  try {
    // Testa conexão com o banco antes de iniciar
    console.log("🔌 Testando conexão com PostgreSQL...");
    const connected = await testConnection();
    
    if (!connected) {
      throw new Error("Não foi possível conectar ao banco de dados. Verifique o Docker e as variáveis de ambiente.");
    }

    const app = await buildApp();

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
