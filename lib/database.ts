import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var databasePool: Pool | undefined;
}

export function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
}

function shouldUseSsl(connectionString: string) {
  if (process.env.POSTGRES_SSL === "false") {
    return false;
  }

  return process.env.POSTGRES_SSL === "true" || connectionString.includes("sslmode=require") || Boolean(process.env.VERCEL);
}

function getPgConnectionString(connectionString: string) {
  try {
    const url = new URL(connectionString);
    if (url.searchParams.get("sslmode") === "require") {
      url.searchParams.delete("sslmode");
    }
    return url.toString();
  } catch {
    return connectionString;
  }
}

export function getPool() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    throw new Error("DATABASE_URL or POSTGRES_URL is not set");
  }

  if (!globalThis.databasePool) {
    globalThis.databasePool = new Pool({
      connectionString: getPgConnectionString(connectionString),
      max: 5,
      idleTimeoutMillis: 30_000,
      ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined
    });
  }

  return globalThis.databasePool;
}
