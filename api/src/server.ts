import { buildApp } from "./app";
import { config } from "./config/app.config";
import { testConnection, db } from "./db";
import { migrate } from "drizzle-orm/node-postgres/migrator";
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
      throw new Error(
        "Não foi possível conectar ao banco de dados. Verifique o Docker e as variáveis de ambiente.",
      );
    }

    // Executar migrations automaticamente (apenas se não for produção ou se forçado)
    const shouldRunMigrations =
      config.env !== "production" || process.env.FORCE_MIGRATE === "true";
    if (shouldRunMigrations) {
      console.log("🚀 Executando migrations do banco de dados...");
      try {
        await migrate(db, {
          migrationsFolder: "./drizzle",
        });
        console.log("✅ Migrations executadas com sucesso!");
      } catch (error) {
        console.error("❌ Erro ao executar migrations:", error);
        // Continua mesmo com erro em migrate (pode ser que já foram aplicadas)
      }
    } else {
      console.log(
        "⏭️  Pulando migrations (ambiente produção). Execute manualmente se necessário.",
      );
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

// Inicia a aplicação
start();
