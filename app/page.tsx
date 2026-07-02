import Link from "next/link";
import type { ReactNode } from "react";
import { Activity, ArrowUpRight, BarChart3, Cpu, Headphones, Newspaper, PlayCircle, Radio, Zap } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { StoryRail } from "@/components/StoryRail";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, getAllArticleMeta, getCategories, slugify, type ArticleMeta } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

function isArticle(article: ArticleMeta | undefined): article is ArticleMeta {
  return Boolean(article);
}

export default function HomePage() {
  const articles = getAllArticleMeta();
  const [lead, second, third, fourth, ...rest] = articles;
  const categories = getCategories();
  const spotlight = [second, third, fourth].filter(isArticle);
  const latestRail = rest.filter(isArticle).slice(0, 8);
  const departmentBlocks = categories.slice(0, 6).map((category) => {
    const categoryArticles = articles.filter((article) => slugify(article.category) === category.slug);
    return {
      ...category,
      lead: categoryArticles[0],
      articles: categoryArticles.slice(1, 4)
    };
  });
  const totalSources = articles.reduce((sum, article) => sum + (article.sourceCount ?? 0), 0);
  const audioCount = articles.filter((article) => Boolean(article.audioUrl)).length;

  return (
    <main>
      {lead ? (
        <section className="frontpage-bg border-b-2 border-foreground/20 text-foreground dark:border-white/10 dark:text-white" id="latest">
          <div className="site-shell py-3 md:py-5">
            <div className="issue-strip">
              <span>AI business front page</span>
              <span>{formatDate(lead.date)}</span>
              <span>{articles.length} stories / {totalSources} linked sources / {audioCount} audio editions</span>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_315px]">
              <div className="grid gap-3">
                <article className="lead-package">
                  <div className="grid gap-0 lg:grid-cols-[minmax(260px,0.82fr)_minmax(0,1.18fr)]">
                    <Link className="thumb-frame block aspect-[16/10] lg:aspect-[4/5]" href={`/articles/${lead.slug}`} aria-label={lead.title}>
                      <img className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]" src={lead.cover} alt="" />
                    </Link>
                    <div className="flex min-h-full flex-col p-4 sm:p-5 lg:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="section-chip">{lead.category}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground dark:text-white/50">
                          {formatDate(lead.date)}
                        </span>
                        {lead.audioUrl ? <Headphones size={13} className="text-[var(--brand-teal)] dark:text-[var(--brand-gold)]" aria-hidden /> : null}
                      </div>
                      <h1 className="headline-xl mt-3">
                        <Link href={`/articles/${lead.slug}`}>{lead.title}</Link>
                      </h1>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground dark:text-white/68">
                        {lead.description}
                      </p>
                      <div className="mt-5 grid gap-2 sm:grid-cols-3">
                        <InsightCell label="Beat" value={lead.category} />
                        <InsightCell label="Sources" value={`${lead.sourceCount ?? 0} linked`} />
                        <InsightCell label="Read" value={`${lead.readingMinutes} min`} />
                      </div>
                      <div className="mt-auto flex flex-wrap gap-2 pt-5">
                        <Link className={buttonVariants({ className: "rounded-none bg-[var(--brand-ink)] text-white hover:bg-[var(--brand-ink)]/86 dark:bg-white dark:text-[var(--brand-ink)] dark:hover:bg-white/90" })} href={`/articles/${lead.slug}`}>
                          Read the lead <ArrowUpRight aria-hidden />
                        </Link>
                        {lead.audioUrl ? (
                          <a className={buttonVariants({ variant: "outline", className: "rounded-none border-foreground/25 bg-transparent dark:border-white/20" })} href={lead.audioUrl}>
                            Audio <Headphones aria-hidden />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>

                <div className="grid gap-3 md:grid-cols-3">
                  {spotlight.map((article, index) => (
                    <SpotlightStory article={article} index={index + 1} key={article.slug} />
                  ))}
                </div>
              </div>

              <aside className="grid gap-3 lg:content-start">
                <MarketTape articleCount={articles.length} audioCount={audioCount} sourceCount={totalSources} />
                <StoryRail title="Most recent" articles={latestRail} />
              </aside>
            </div>
          </div>
        </section>
      ) : (
        <section className="site-shell py-10">
          <p className="text-muted-foreground">No articles have been published yet.</p>
        </section>
      )}

      <section className="border-y-2 border-[var(--brand-ink)] bg-[var(--brand-ink)] text-white dark:border-white/10">
        <div className="site-shell grid gap-0 py-0 sm:grid-cols-2 lg:grid-cols-4">
          <Signal icon={<Cpu size={15} aria-hidden />} label="Infrastructure" value="Chips, cloud, data centers, power, capacity" />
          <Signal icon={<BarChart3 size={15} aria-hidden />} label="Markets" value="Earnings, funding, multiples, enterprise spend" />
          <Signal icon={<Zap size={15} aria-hidden />} label="Products" value="Agents, models, media tools, enterprise platforms" />
          <Signal icon={<Activity size={15} aria-hidden />} label="Policy" value="Regulation, copyright, labor, public-sector adoption" />
        </div>
      </section>

      <section className="site-shell py-6 md:py-8">
        <div className="section-head">
          <div>
            <p className="kicker">Departments</p>
            <h2 className="mt-1 font-serif text-3xl font-bold leading-tight md:text-5xl">Where the AI business story is moving</h2>
          </div>
          <Link className={buttonVariants({ variant: "outline", className: "rounded-none" })} href="/#all-stories">
            Full index <ArrowUpRight aria-hidden />
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {departmentBlocks.map((department, index) => (
            <DepartmentCard
              article={department.lead}
              articles={department.articles}
              count={department.count}
              index={index + 1}
              key={department.slug}
              name={department.name}
              slug={department.slug}
            />
          ))}
        </div>
      </section>

      <section className="site-shell pb-9 md:pb-12" id="all-stories">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_315px]">
          <div>
            <div className="section-head mb-1">
              <div>
                <p className="kicker">Index</p>
                <h2 className="mt-1 font-serif text-3xl font-bold md:text-5xl">All articles</h2>
              </div>
              <span className="hidden text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground dark:text-white/50 sm:block">
                Sorted by publish date
              </span>
            </div>
            <div className="issue-index">
              {articles.map((article, index) => (
                <IndexedStory article={article} index={index + 1} key={article.slug} />
              ))}
            </div>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="newsletter-block">
              <div className="flex items-center gap-2 text-[var(--brand-gold)]">
                <Radio size={16} aria-hidden />
                <p className="text-[10px] font-black uppercase tracking-[0.16em]">Newsletter</p>
              </div>
              <h3 className="mt-3 font-serif text-3xl font-bold leading-tight">The AI business briefing, without the noise.</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Coverage grouped by company, category, and market signal.
              </p>
              <NewsletterSignup />
            </div>
            <div className="editorial-panel border-t-4 border-t-[var(--brand-cobalt)] p-4 dark:border-t-[var(--brand-teal)]">
              <p className="kicker">Channels</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a className={buttonVariants({ variant: "outline", className: "rounded-none" })} href={siteConfig.youtubeUrl}>
                  YouTube <PlayCircle aria-hidden />
                </a>
                {siteConfig.tiktokUrl ? (
                  <a className={buttonVariants({ variant: "outline", className: "rounded-none" })} href={siteConfig.tiktokUrl}>
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

function InsightCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-foreground/15 bg-white/45 p-2 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground dark:text-white/45">{label}</p>
      <p className="mt-1 truncate text-xs font-black uppercase tracking-[0.08em]">{value}</p>
    </div>
  );
}

function SpotlightStory({ article, index }: { article: ArticleMeta; index: number }) {
  return (
    <article className="spotlight-card group">
      <Link className="thumb-frame block aspect-[16/9]" href={`/articles/${article.slug}`} aria-label={article.title}>
        <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src={article.cover} alt="" />
      </Link>
      <div className="p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="section-chip">{article.category}</span>
          <span className="font-serif text-2xl font-bold text-[var(--brand-vermilion)] dark:text-[var(--brand-gold)]">
            {String(index).padStart(2, "0")}
          </span>
        </div>
        <h2 className="mt-2 line-clamp-3 font-serif text-xl font-bold leading-tight group-hover:underline">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h2>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground dark:text-white/58">{article.description}</p>
      </div>
    </article>
  );
}

function MarketTape({ articleCount, audioCount, sourceCount }: { articleCount: number; audioCount: number; sourceCount: number }) {
  return (
    <div className="market-tape">
      <div className="flex items-center gap-2 text-[var(--brand-vermilion)] dark:text-[var(--brand-gold)]">
        <Newspaper size={16} aria-hidden />
        <p className="text-[10px] font-black uppercase tracking-[0.16em]">Market tape</p>
      </div>
      <div className="mt-4 grid grid-cols-3 border border-foreground/15 dark:border-white/12">
        <Metric value={articleCount} label="Stories" />
        <Metric value={sourceCount} label="Sources" />
        <Metric value={audioCount} label="Audio" />
      </div>
      <p className="mt-4 font-serif text-2xl font-bold leading-tight">
        A front page for the companies turning model capability into leverage.
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-r border-foreground/15 p-3 last:border-r-0 dark:border-white/12">
      <p className="font-serif text-2xl font-bold">{value}</p>
      <p className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-muted-foreground dark:text-white/55">{label}</p>
    </div>
  );
}

function DepartmentCard({
  article,
  articles,
  count,
  index,
  name,
  slug
}: {
  article?: ArticleMeta;
  articles: ArticleMeta[];
  count: number;
  index: number;
  name: string;
  slug: string;
}) {
  return (
    <section className="department-card">
      <div className="flex items-start justify-between gap-3 border-b border-foreground/15 pb-3 dark:border-white/10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--brand-vermilion)] dark:text-[var(--brand-gold)]">
            Dept. {String(index).padStart(2, "0")}
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold leading-tight">{name}</h3>
        </div>
        <Link className="shrink-0 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground dark:text-white/50 dark:hover:text-white" href={`/categories/${slug}`}>
          {count} stories <ArrowUpRight size={13} className="inline" aria-hidden />
        </Link>
      </div>
      {article ? (
        <Link className="group mt-3 grid gap-3" href={`/articles/${article.slug}`}>
          <img className="aspect-[16/9] w-full object-cover" src={article.cover} alt="" />
          <div>
            <h4 className="line-clamp-2 font-serif text-xl font-bold leading-tight group-hover:underline">{article.title}</h4>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground dark:text-white/58">{article.description}</p>
          </div>
        </Link>
      ) : null}
      {articles.length > 0 ? (
        <div className="mt-4 border-t border-foreground/15 dark:border-white/10">
          {articles.map((item) => (
            <Link className="group block border-b border-foreground/10 py-2.5 last:border-b-0 dark:border-white/10" href={`/articles/${item.slug}`} key={item.slug}>
              <span className="line-clamp-2 text-sm font-bold leading-snug group-hover:underline">{item.title}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function IndexedStory({ article, index }: { article: ArticleMeta; index: number }) {
  return (
    <article className="group grid grid-cols-[2.2rem_minmax(0,1fr)] gap-3 border-b border-foreground/15 py-3 dark:border-white/10 sm:grid-cols-[3rem_118px_minmax(0,1fr)_auto]">
      <span className="font-serif text-xl font-bold text-[var(--brand-vermilion)] dark:text-[var(--brand-gold)]">{String(index).padStart(2, "0")}</span>
      <Link className="thumb-frame hidden aspect-[16/10] sm:block" href={`/articles/${article.slug}`} aria-label={article.title}>
        <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src={article.cover} alt="" />
      </Link>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="section-chip">{article.category}</span>
          {article.audioUrl ? <Headphones size={13} className="text-[var(--brand-teal)] dark:text-[var(--brand-gold)]" aria-hidden /> : null}
        </div>
        <h3 className="mt-1.5 line-clamp-2 font-serif text-lg font-bold leading-tight group-hover:underline sm:text-xl">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground dark:text-white/58 sm:text-sm sm:leading-6">{article.description}</p>
      </div>
      <div className="col-start-2 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground dark:text-white/50 sm:col-start-auto sm:block sm:text-right">
        <p>{formatDate(article.date)}</p>
        <p>{article.readingMinutes} min</p>
      </div>
    </article>
  );
}

function Signal({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="border-b border-white/15 py-3 sm:border-r sm:px-4 sm:last:border-r-0 lg:border-b-0">
      <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--brand-gold)]">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-bold leading-snug text-white/80">{value}</p>
    </div>
  );
}
