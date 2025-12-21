/**
 * Configurações da aplicação
 */
export const config = {
  // Servidor
  port: parseInt(process.env.PORT || "3333", 10),
  host: process.env.HOST || "0.0.0.0",

  // Ambiente
  env: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV !== "production",
  isProduction: process.env.NODE_ENV === "production",

  // CORS - URLs permitidas
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : ["http://localhost:3000", "http://localhost:3001"],

  // API
  apiPrefix: "/api/v1",

  // Logging
  enableLogging: process.env.ENABLE_LOGGING !== "false",
} as const;
