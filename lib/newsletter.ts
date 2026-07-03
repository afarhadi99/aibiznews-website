import { Pool } from "pg";

type NewsletterSignup = {
  email: string;
  source?: string;
  userAgent?: string | null;
};

declare global {
  // eslint-disable-next-line no-var
  var newsletterPool: Pool | undefined;
}

let tableReady: Promise<void> | null = null;

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
}

function useSsl(connectionString: string) {
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

function getPool() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    throw new Error("DATABASE_URL or POSTGRES_URL is not set");
  }

  if (!globalThis.newsletterPool) {
    globalThis.newsletterPool = new Pool({
      connectionString: getPgConnectionString(connectionString),
      max: 5,
      idleTimeoutMillis: 30_000,
      ssl: useSsl(connectionString) ? { rejectUnauthorized: false } : undefined
    });
  }

  return globalThis.newsletterPool;
}

async function ensureNewsletterTable() {
  if (!tableReady) {
    tableReady = getPool()
      .query(`
        create table if not exists newsletter_subscribers (
          id bigserial primary key,
          email text not null unique,
          source text not null default 'site',
          user_agent text,
          is_active boolean not null default true,
          subscribed_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        );
      `)
      .then(() => undefined)
      .catch((error) => {
        tableReady = null;
        throw error;
      });
  }

  return tableReady;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export async function saveNewsletterSignup({ email, source = "site", userAgent = null }: NewsletterSignup) {
  await ensureNewsletterTable();

  const result = await getPool().query<{ id: string; email: string }>(
    `
      insert into newsletter_subscribers (email, source, user_agent)
      values ($1, $2, $3)
      on conflict (email)
      do update set
        source = excluded.source,
        user_agent = excluded.user_agent,
        is_active = true,
        updated_at = now()
      returning id, email;
    `,
    [normalizeEmail(email), source.slice(0, 80), userAgent?.slice(0, 500) ?? null]
  );

  return result.rows[0];
}
