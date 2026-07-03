import { getPool } from "@/lib/database";

type PageEventInput = {
  path: string;
  title?: string;
  referrer?: string;
  sessionId?: string;
  userAgent?: string | null;
};

export type TopPage = {
  path: string;
  title: string | null;
  views: number;
  lastSeen: string;
};

export type ReferrerStat = {
  referrer: string;
  views: number;
};

export type RecentPageView = {
  path: string;
  title: string | null;
  referrer: string | null;
  createdAt: string;
};

export type DailyPageView = {
  day: string;
  views: number;
};

let analyticsTableReady: Promise<void> | null = null;

export async function ensureAnalyticsTable() {
  if (!analyticsTableReady) {
    analyticsTableReady = getPool()
      .query(`
        create table if not exists page_events (
          id bigserial primary key,
          event_type text not null default 'page_view',
          path text not null,
          title text,
          referrer text,
          session_id text,
          user_agent text,
          created_at timestamptz not null default now()
        );

        create index if not exists page_events_created_at_idx on page_events (created_at desc);
        create index if not exists page_events_path_idx on page_events (path);
      `)
      .then(() => undefined)
      .catch((error) => {
        analyticsTableReady = null;
        throw error;
      });
  }

  return analyticsTableReady;
}

function cleanText(value: string | undefined, maxLength: number) {
  const normalized = value?.trim();
  if (!normalized) {
    return null;
  }
  return normalized.slice(0, maxLength);
}

export async function recordPageEvent({ path, title, referrer, sessionId, userAgent }: PageEventInput) {
  await ensureAnalyticsTable();

  await getPool().query(
    `
      insert into page_events (path, title, referrer, session_id, user_agent)
      values ($1, $2, $3, $4, $5);
    `,
    [
      path.slice(0, 500),
      cleanText(title, 250),
      cleanText(referrer, 500),
      cleanText(sessionId, 120),
      cleanText(userAgent ?? undefined, 500)
    ]
  );
}

export async function getAnalyticsDashboardData() {
  await ensureAnalyticsTable();

  const [totals, topPages, referrers, recentViews, dailyViews] = await Promise.all([
    getPool().query<{
      total: string;
      last_24h: string;
      last_7d: string;
      unique_14d: string;
    }>(`
      select
        count(*)::text as total,
        count(*) filter (where created_at >= now() - interval '24 hours')::text as last_24h,
        count(*) filter (where created_at >= now() - interval '7 days')::text as last_7d,
        count(distinct session_id) filter (where session_id is not null and created_at >= now() - interval '14 days')::text as unique_14d
      from page_events;
    `),
    getPool().query<{
      path: string;
      title: string | null;
      views: string;
      last_seen: Date;
    }>(`
      select
        path,
        max(title) filter (where title is not null) as title,
        count(*)::text as views,
        max(created_at) as last_seen
      from page_events
      where created_at >= now() - interval '14 days'
      group by path
      order by count(*) desc, max(created_at) desc
      limit 12;
    `),
    getPool().query<{
      referrer: string;
      views: string;
    }>(`
      select
        case
          when referrer is null or referrer = '' then 'Direct / unknown'
          else regexp_replace(referrer, '^https?://([^/]+).*$','\\1')
        end as referrer,
        count(*)::text as views
      from page_events
      where created_at >= now() - interval '14 days'
      group by 1
      order by count(*) desc
      limit 10;
    `),
    getPool().query<{
      path: string;
      title: string | null;
      referrer: string | null;
      created_at: Date;
    }>(`
      select path, title, referrer, created_at
      from page_events
      order by created_at desc
      limit 25;
    `),
    getPool().query<{
      day: Date;
      views: string;
    }>(`
      select date_trunc('day', created_at) as day, count(*)::text as views
      from page_events
      where created_at >= now() - interval '14 days'
      group by 1
      order by 1;
    `)
  ]);

  const summary = totals.rows[0] ?? { total: "0", last_24h: "0", last_7d: "0", unique_14d: "0" };

  return {
    totalViews: Number(summary.total),
    views24h: Number(summary.last_24h),
    views7d: Number(summary.last_7d),
    uniqueVisitors14d: Number(summary.unique_14d),
    topPages: topPages.rows.map((row) => ({
      path: row.path,
      title: row.title,
      views: Number(row.views),
      lastSeen: row.last_seen.toISOString()
    })) satisfies TopPage[],
    referrers: referrers.rows.map((row) => ({
      referrer: row.referrer,
      views: Number(row.views)
    })) satisfies ReferrerStat[],
    recentViews: recentViews.rows.map((row) => ({
      path: row.path,
      title: row.title,
      referrer: row.referrer,
      createdAt: row.created_at.toISOString()
    })) satisfies RecentPageView[],
    dailyViews: dailyViews.rows.map((row) => ({
      day: row.day.toISOString().slice(0, 10),
      views: Number(row.views)
    })) satisfies DailyPageView[]
  };
}
