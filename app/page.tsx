import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, BarChart3, Cpu, Headphones, Landmark, PlayCircle, Radio } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, getAllArticleMeta, getCategories, slugify, type ArticleMeta } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

function isArticle(article: ArticleMeta | undefined): article is ArticleMeta {
  return Boolean(article);
}

export default function HomePage() {
  const articles = getAllArticleMeta();
  const [lead, second, third, fourth, fifth, ...rest] = articles;
  const sideStories = [second, third, fourth].filter(isArticle);
  const editorPicks = [fifth, ...rest].filter(isArticle).slice(0, 5);
  const categories = getCategories();
  const departments = categories.slice(0, 6).map((category) => {
    const items = articles.filter((article) => slugify(article.category) === category.slug);
    return { ...category, lead: items[0], articles: items.slice(1, 3) };
  });
  const sourceCount = articles.reduce((sum, article) => sum + (article.sourceCount ?? 0), 0);
  const audioCount = articles.filter((article) => article.audioUrl).length;

  return (
    <main>
      {lead ? (
        <section className="briefing-hero" id="latest">
          <div className="site-shell py-5 md:py-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-foreground/12 pb-3 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="soft-label">Today&apos;s briefing</span>
                <span className="text-sm font-medium text-muted-foreground dark:text-white/58">{formatDate(lead.date)}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground dark:text-white/58">
                <span>{articles.length} stories</span>
                <span>{sourceCount} sources</span>
                <span>{audioCount} audio editions</span>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_305px]">
              <article className="feature-story group">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)]">
                  <Link className="thumb-frame order-first block aspect-[16/10] lg:order-last lg:aspect-auto" href={`/articles/${lead.slug}`} aria-label={lead.title}>
                    <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" src={lead.cover} alt="" />
                  </Link>
                  <div className="order-last flex flex-col p-4 sm:p-5 lg:order-first lg:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="section-chip">{lead.category}</span>
                      {lead.audioUrl ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-teal)]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--brand-teal)] dark:bg-white/10 dark:text-[var(--brand-gold)]">
                          <Headphones size={12} aria-hidden /> Audio
                        </span>
                      ) : null}
                    </div>
                    <h1 className="friendly-headline mt-3">
                      <Link href={`/articles/${lead.slug}`}>{lead.title}</Link>
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground dark:text-white/68">
                      {lead.description}
                    </p>
                    <div className="mt-5 hidden gap-2 sm:grid sm:grid-cols-3">
                      <InfoPill label="Category" value={lead.category} />
                      <InfoPill label="Sources" value={`${lead.sourceCount ?? 0} linked`} />
                      <InfoPill label="Read" value={`${lead.readingMinutes} min`} />
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      <Link className={buttonVariants({ className: "rounded-md bg-[var(--brand-ink)] text-white hover:bg-[var(--brand-ink)]/86 dark:bg-white dark:text-[var(--brand-ink)] dark:hover:bg-white/90" })} href={`/articles/${lead.slug}`}>
                        Read story <ArrowUpRight aria-hidden />
                      </Link>
                      {lead.audioUrl ? (
                        <a className={buttonVariants({ variant: "outline", className: "rounded-md border-foreground/20 bg-transparent dark:border-white/20" })} href={lead.audioUrl}>
                          Listen <Headphones aria-hidden />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>

              <aside className="grid content-start gap-3">
                <div className="briefing-card">
                  <div className="flex items-center gap-2 text-[var(--brand-vermilion)] dark:text-[var(--brand-gold)]">
                    <Radio size={16} aria-hidden />
                    <p className="text-sm font-bold">Why it matters</p>
                  </div>
                  <p className="mt-3 font-serif text-xl font-bold leading-tight sm:text-[1.45rem]">
                    Follow the companies turning chips, software, data, devices, and AI capability into revenue, distribution, and market power.
                  </p>
                </div>
                <div className="latest-stack">
                  <div className="flex items-center justify-between border-b border-foreground/12 pb-2 dark:border-white/10">
                    <p className="text-sm font-black">Fresh reads</p>
                    <ArrowUpRight size={15} className="text-muted-foreground" aria-hidden />
                  </div>
                  {editorPicks.map((article, index) => (
                    <CompactPick article={article} index={index + 1} key={article.slug} />
                  ))}
                </div>
              </aside>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {sideStories.map((article) => (
                <WarmStoryCard article={article} key={article.slug} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="site-shell py-10">
          <p className="text-muted-foreground">No articles have been published yet.</p>
        </section>
      )}

      <section className="border-y border-foreground/12 bg-[var(--brand-surface)] dark:border-white/10 dark:bg-white/[0.035]">
        <div className="site-shell grid gap-0 py-0 sm:grid-cols-2 lg:grid-cols-4">
          <Signal icon={<Cpu size={15} aria-hidden />} label="Infrastructure" value="Chips, cloud, data centers, power" />
          <Signal icon={<BarChart3 size={15} aria-hidden />} label="Markets" value="Earnings, funding, enterprise spend" />
          <Signal icon={<Radio size={15} aria-hidden />} label="Platforms" value="Apps, agents, models, media tools" />
          <Signal icon={<Landmark size={15} aria-hidden />} label="Policy" value="Regulation, labor, privacy, copyright" />
        </div>
      </section>

      <section className="site-shell py-7 md:py-10">
        <SectionHeader eyebrow="Departments" title="Explore the technology beat" actionHref="/#all-stories" actionLabel="Full index" />
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {departments.map((department) => (
            <DepartmentPanel
              article={department.lead}
              articles={department.articles}
              count={department.count}
              key={department.slug}
              name={department.name}
              slug={department.slug}
            />
          ))}
        </div>
      </section>

      <section className="site-shell pb-10 md:pb-14" id="all-stories">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div>
            <SectionHeader eyebrow="Latest" title="All stories" />
            <div className="mt-3 divide-y divide-foreground/10 border-y border-foreground/12 dark:divide-white/10 dark:border-white/10">
              {articles.map((article) => (
                <IndexRow article={article} key={article.slug} />
              ))}
            </div>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="newsletter-panel">
              <p className="soft-label bg-white/16 text-white dark:bg-white/10">Newsletter</p>
              <h3 className="mt-4 font-serif text-3xl font-bold leading-tight">A calmer way to track technology markets.</h3>
              <p className="mt-3 text-sm leading-6 text-white/72">
                A concise briefing grouped by companies, chips, software, security, markets, and policy.
              </p>
              <NewsletterSignup />
            </div>
            <div className="friendly-panel p-4">
              <p className="soft-label">Channels</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a className={buttonVariants({ variant: "outline", className: "rounded-md" })} href={siteConfig.youtubeUrl}>
                  YouTube <PlayCircle aria-hidden />
                </a>
                {siteConfig.tiktokUrl ? (
                  <a className={buttonVariants({ variant: "outline", className: "rounded-md" })} href={siteConfig.tiktokUrl}>
                    TikTok <ArrowUpRight aria-hidden />
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function SectionHeader({ eyebrow, title, actionHref, actionLabel }: { eyebrow: string; title: string; actionHref?: string; actionLabel?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-foreground/12 pb-3 dark:border-white/10">
      <div>
        <p className="soft-label">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl font-bold leading-tight md:text-4xl">{title}</h2>
      </div>
      {actionHref && actionLabel ? (
        <Link className={buttonVariants({ variant: "outline", className: "rounded-md" })} href={actionHref}>
          {actionLabel} <ArrowUpRight aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-foreground/10 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground dark:text-white/45">{label}</p>
      <p className="mt-1 truncate text-sm font-bold">{value}</p>
    </div>
  );
}

function CompactPick({ article, index }: { article: ArticleMeta; index: number }) {
  return (
    <Link className="group grid grid-cols-[2rem_minmax(0,1fr)] gap-2 border-b border-foreground/10 py-3 last:border-b-0 dark:border-white/10" href={`/articles/${article.slug}`}>
      <span className="font-serif text-lg font-bold text-[var(--brand-vermilion)] dark:text-[var(--brand-gold)]">{String(index).padStart(2, "0")}</span>
      <span>
        <span className="line-clamp-2 block font-serif text-base font-bold leading-snug group-hover:underline">{article.title}</span>
        <span className="mt-1 block text-xs text-muted-foreground dark:text-white/50">{formatDate(article.date)} / {article.readingMinutes} min</span>
      </span>
    </Link>
  );
}

function WarmStoryCard({ article }: { article: ArticleMeta }) {
  return (
    <article className="friendly-panel group overflow-hidden">
      <Link className="thumb-frame block aspect-[16/9]" href={`/articles/${article.slug}`} aria-label={article.title}>
        <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src={article.cover} alt="" />
      </Link>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="section-chip">{article.category}</span>
          {article.audioUrl ? <Headphones size={13} className="text-[var(--brand-teal)] dark:text-[var(--brand-gold)]" aria-hidden /> : null}
        </div>
        <h2 className="mt-3 line-clamp-3 font-serif text-2xl font-bold leading-tight group-hover:underline">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground dark:text-white/58">{article.description}</p>
      </div>
    </article>
  );
}

function DepartmentPanel({ article, articles, count, name, slug }: { article?: ArticleMeta; articles: ArticleMeta[]; count: number; name: string; slug: string }) {
  return (
    <section className="friendly-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="soft-label">{name}</p>
          <p className="mt-2 text-sm text-muted-foreground dark:text-white/55">{count} stories</p>
        </div>
        <Link className="text-sm font-semibold text-[var(--brand-teal)] hover:underline dark:text-[var(--brand-gold)]" href={`/categories/${slug}`}>
          View <ArrowUpRight size={14} className="inline" aria-hidden />
        </Link>
      </div>
      {article ? (
        <Link className="group mt-4 block" href={`/articles/${article.slug}`}>
          <img className="aspect-[16/9] w-full rounded-md object-cover" src={article.cover} alt="" />
          <h3 className="mt-3 line-clamp-2 font-serif text-xl font-bold leading-tight group-hover:underline">{article.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground dark:text-white/58">{article.description}</p>
        </Link>
      ) : null}
      {articles.length > 0 ? (
        <div className="mt-4 divide-y divide-foreground/10 border-t border-foreground/10 dark:divide-white/10 dark:border-white/10">
          {articles.map((item) => (
            <Link className="group block py-3" href={`/articles/${item.slug}`} key={item.slug}>
              <span className="line-clamp-2 text-sm font-semibold leading-snug group-hover:underline">{item.title}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function IndexRow({ article }: { article: ArticleMeta }) {
  return (
    <article className="group grid gap-3 py-4 sm:grid-cols-[112px_minmax(0,1fr)_auto]">
      <Link className="thumb-frame aspect-[16/10] rounded-md" href={`/articles/${article.slug}`} aria-label={article.title}>
        <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src={article.cover} alt="" />
      </Link>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="section-chip">{article.category}</span>
          {article.audioUrl ? <Badge variant="secondary" className="rounded-md">Audio</Badge> : null}
        </div>
        <h3 className="mt-2 line-clamp-2 font-serif text-xl font-bold leading-tight group-hover:underline">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground dark:text-white/58">{article.description}</p>
      </div>
      <div className="flex gap-2 text-xs text-muted-foreground dark:text-white/50 sm:block sm:text-right">
        <p>{formatDate(article.date)}</p>
        <p>{article.readingMinutes} min</p>
      </div>
    </article>
  );
}

function Signal({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="border-b border-foreground/10 py-4 sm:border-r sm:px-4 sm:last:border-r-0 lg:border-b-0 dark:border-white/10">
      <p className="flex items-center gap-2 text-sm font-bold text-[var(--brand-teal)] dark:text-[var(--brand-gold)]">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm leading-snug text-muted-foreground dark:text-white/58">{value}</p>
    </div>
  );
}
