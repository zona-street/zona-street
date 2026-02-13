import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { format } from "date-fns";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL não definida");
}

if (!existsSync("backups")) {
  mkdirSync("backups");
}

const date = format(new Date(), "yyyy-MM-dd");
const file = `backups/prod_${date}.sql`;

console.log("📦 Gerando backup...");

execSync(`pg_dump "${databaseUrl}" -f ${file}`, {
  stdio: "inherit",
});

console.log("✅ Backup criado em:", file);
