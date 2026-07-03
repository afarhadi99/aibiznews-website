import { getPool } from "@/lib/database";

type NewsletterSignup = {
  email: string;
  source?: string;
  userAgent?: string | null;
};

let tableReady: Promise<void> | null = null;

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

export type NewsletterSubscriber = {
  id: string;
  email: string;
  source: string;
  userAgent: string | null;
  isActive: boolean;
  subscribedAt: string;
  updatedAt: string;
};

export async function getNewsletterDashboardData() {
  await ensureNewsletterTable();

  const [totals, recent] = await Promise.all([
    getPool().query<{
      total: string;
      active: string;
      last_24h: string;
      last_7d: string;
    }>(`
      select
        count(*)::text as total,
        count(*) filter (where is_active)::text as active,
        count(*) filter (where subscribed_at >= now() - interval '24 hours')::text as last_24h,
        count(*) filter (where subscribed_at >= now() - interval '7 days')::text as last_7d
      from newsletter_subscribers;
    `),
    getPool().query<{
      id: string;
      email: string;
      source: string;
      user_agent: string | null;
      is_active: boolean;
      subscribed_at: Date;
      updated_at: Date;
    }>(`
      select id::text, email, source, user_agent, is_active, subscribed_at, updated_at
      from newsletter_subscribers
      order by subscribed_at desc
      limit 100;
    `)
  ]);

  const summary = totals.rows[0] ?? { total: "0", active: "0", last_24h: "0", last_7d: "0" };

  return {
    total: Number(summary.total),
    active: Number(summary.active),
    last24h: Number(summary.last_24h),
    last7d: Number(summary.last_7d),
    recent: recent.rows.map((subscriber) => ({
      id: subscriber.id,
      email: subscriber.email,
      source: subscriber.source,
      userAgent: subscriber.user_agent,
      isActive: subscriber.is_active,
      subscribedAt: subscriber.subscribed_at.toISOString(),
      updatedAt: subscriber.updated_at.toISOString()
    })) satisfies NewsletterSubscriber[]
  };
}
