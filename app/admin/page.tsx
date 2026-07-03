import Link from "next/link";
import { BarChart3, ExternalLink, Mail, MousePointerClick, Users } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getNewsletterDashboardData } from "@/lib/newsletter";
import { getAnalyticsDashboardData } from "@/lib/siteAnalytics";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const numberFormat = new Intl.NumberFormat("en-US");
const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});

function formatNumber(value: number) {
  return numberFormat.format(value);
}

function formatDateTime(value: string) {
  return dateTimeFormat.format(new Date(value));
}

export default async function AdminPage() {
  await requireAdmin();

  const [newsletter, analytics] = await Promise.all([
    getNewsletterDashboardData(),
    getAnalyticsDashboardData()
  ]);
  const maxDailyViews = Math.max(...analytics.dailyViews.map((day) => day.views), 1);

  return (
    <main className="site-shell py-6 md:py-9">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-foreground/15 pb-5 dark:border-white/10">
        <div>
          <p className="soft-label">Admin</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight md:text-5xl">Audience dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground dark:text-white/58">
            Newsletter signups from Neon plus first-party page analytics. Vercel Web Analytics also runs on the public site.
          </p>
        </div>
        <form action={logoutAction}>
          <Button className="rounded-md" variant="outline" type="submit">
            Sign out
          </Button>
        </form>
      </div>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={<Mail size={18} aria-hidden />} label="Subscribers" value={newsletter.total} note={`${newsletter.last7d} in 7 days`} />
        <MetricCard icon={<Users size={18} aria-hidden />} label="Active" value={newsletter.active} note={`${newsletter.last24h} in 24 hours`} />
        <MetricCard icon={<MousePointerClick size={18} aria-hidden />} label="Page views" value={analytics.totalViews} note={`${analytics.views7d} in 7 days`} />
        <MetricCard icon={<BarChart3 size={18} aria-hidden />} label="Visitors" value={analytics.uniqueVisitors14d} note={`${analytics.views24h} views in 24 hours`} />
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="rounded-md border-foreground/15 py-0 shadow-none dark:border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3 border-b border-foreground/10 pb-3 dark:border-white/10">
              <div>
                <p className="kicker">Traffic</p>
                <h2 className="font-serif text-2xl font-bold">Page views by day</h2>
              </div>
              <Badge variant="secondary" className="rounded-sm">14 days</Badge>
            </div>
            <div className="mt-5 grid grid-cols-7 items-end gap-2 md:grid-cols-[repeat(14,minmax(0,1fr))]">
              {analytics.dailyViews.map((day) => (
                <div className="grid gap-2" key={day.day}>
                  <div className="flex h-32 items-end rounded-sm bg-muted/60 px-1 dark:bg-white/5">
                    <div
                      className="w-full rounded-sm bg-[var(--brand-teal)] dark:bg-[var(--brand-gold)]"
                      style={{ height: `${Math.max((day.views / maxDailyViews) * 100, 4)}%` }}
                      title={`${day.day}: ${day.views} views`}
                    />
                  </div>
                  <span className="truncate text-center text-[10px] text-muted-foreground dark:text-white/45">{day.day.slice(5)}</span>
                </div>
              ))}
              {analytics.dailyViews.length === 0 ? (
                <p className="col-span-full text-sm text-muted-foreground">Page views will appear here after visitors browse the site.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md border-foreground/15 py-0 shadow-none dark:border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3 border-b border-foreground/10 pb-3 dark:border-white/10">
              <div>
                <p className="kicker">Referrers</p>
                <h2 className="font-serif text-2xl font-bold">Sources</h2>
              </div>
              <ExternalLink size={17} className="text-muted-foreground" aria-hidden />
            </div>
            <div className="mt-3 divide-y divide-foreground/10 dark:divide-white/10">
              {analytics.referrers.map((referrer) => (
                <div className="flex items-center justify-between gap-3 py-3 text-sm" key={referrer.referrer}>
                  <span className="min-w-0 truncate font-semibold">{referrer.referrer}</span>
                  <span className="font-mono text-muted-foreground dark:text-white/55">{formatNumber(referrer.views)}</span>
                </div>
              ))}
              {analytics.referrers.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">No referrer data yet.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="rounded-md border-foreground/15 py-0 shadow-none dark:border-white/10">
          <CardContent className="p-4">
            <div className="border-b border-foreground/10 pb-3 dark:border-white/10">
              <p className="kicker">Newsletter</p>
              <h2 className="font-serif text-2xl font-bold">Recent subscribers</h2>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground dark:text-white/45">
                  <tr className="border-b border-foreground/10 dark:border-white/10">
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Source</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Signed up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/10 dark:divide-white/10">
                  {newsletter.recent.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td className="max-w-[260px] truncate py-3 pr-3 font-semibold">{subscriber.email}</td>
                      <td className="py-3 pr-3 text-muted-foreground dark:text-white/58">{subscriber.source}</td>
                      <td className="py-3 pr-3">
                        <Badge variant={subscriber.isActive ? "secondary" : "outline"} className="rounded-sm">
                          {subscriber.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 pr-3 text-muted-foreground dark:text-white/58">{formatDateTime(subscriber.subscribedAt)}</td>
                    </tr>
                  ))}
                  {newsletter.recent.length === 0 ? (
                    <tr>
                      <td className="py-5 text-muted-foreground" colSpan={4}>No subscribers yet.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md border-foreground/15 py-0 shadow-none dark:border-white/10">
          <CardContent className="p-4">
            <div className="border-b border-foreground/10 pb-3 dark:border-white/10">
              <p className="kicker">Pages</p>
              <h2 className="font-serif text-2xl font-bold">Top pages</h2>
            </div>
            <div className="mt-3 divide-y divide-foreground/10 dark:divide-white/10">
              {analytics.topPages.map((page) => (
                <div className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto]" key={page.path}>
                  <div className="min-w-0">
                    <Link className="font-semibold underline-offset-4 hover:underline" href={page.path}>
                      {page.title || page.path}
                    </Link>
                    <p className="mt-1 truncate font-mono text-xs text-muted-foreground dark:text-white/45">{page.path}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-mono text-sm font-bold">{formatNumber(page.views)}</p>
                    <p className="text-xs text-muted-foreground dark:text-white/45">{formatDateTime(page.lastSeen)}</p>
                  </div>
                </div>
              ))}
              {analytics.topPages.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">No page views yet.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-5">
        <Card className="rounded-md border-foreground/15 py-0 shadow-none dark:border-white/10">
          <CardContent className="p-4">
            <div className="border-b border-foreground/10 pb-3 dark:border-white/10">
              <p className="kicker">Live feed</p>
              <h2 className="font-serif text-2xl font-bold">Recent page views</h2>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground dark:text-white/45">
                  <tr className="border-b border-foreground/10 dark:border-white/10">
                    <th className="py-2 pr-3">Page</th>
                    <th className="py-2 pr-3">Referrer</th>
                    <th className="py-2 pr-3">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/10 dark:divide-white/10">
                  {analytics.recentViews.map((view) => (
                    <tr key={`${view.createdAt}-${view.path}`}>
                      <td className="max-w-[360px] py-3 pr-3">
                        <Link className="font-semibold underline-offset-4 hover:underline" href={view.path}>
                          {view.title || view.path}
                        </Link>
                        <p className="mt-1 truncate font-mono text-xs text-muted-foreground dark:text-white/45">{view.path}</p>
                      </td>
                      <td className="max-w-[260px] truncate py-3 pr-3 text-muted-foreground dark:text-white/58">{view.referrer || "Direct / unknown"}</td>
                      <td className="py-3 pr-3 text-muted-foreground dark:text-white/58">{formatDateTime(view.createdAt)}</td>
                    </tr>
                  ))}
                  {analytics.recentViews.length === 0 ? (
                    <tr>
                      <td className="py-5 text-muted-foreground" colSpan={3}>No page views recorded yet.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function MetricCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: number; note: string }) {
  return (
    <Card className="rounded-md border-foreground/15 py-0 shadow-none dark:border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-muted-foreground dark:text-white/58">{label}</p>
          <span className="text-[var(--brand-teal)] dark:text-[var(--brand-gold)]">{icon}</span>
        </div>
        <p className="mt-3 font-serif text-4xl font-bold leading-none">{formatNumber(value)}</p>
        <p className="mt-2 text-xs text-muted-foreground dark:text-white/50">{note}</p>
      </CardContent>
    </Card>
  );
}
