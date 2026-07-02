import Link from "next/link";
import { ArrowUpRight, Headphones, Newspaper, PlayCircle } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { StoryRail } from "@/components/StoryRail";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, getAllArticleMeta, getCategories, slugify } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const articles = getAllArticleMeta();
  const [lead, second, third, ...rest] = articles;
  const categories = getCategories();
  const latestRail = [second, third, ...rest].filter(Boolean).slice(0, 6);
  const defaultCategory = categories[0]?.slug ?? "all";

  return (
    <main>
      <section className="border-b bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0))]">
        <div className="site-shell py-9 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-sm bg-[var(--brand-teal)] text-white">AI Business</Badge>
                <Badge variant="outline" className="rounded-sm">Markets</Badge>
                <Badge variant="outline" className="rounded-sm">Infrastructure</Badge>
              </div>
              <h1 className="mt-5 max-w-5xl font-serif text-5xl font-bold leading-[0.98] md:text-7xl lg:text-8xl">
                The business paper for artificial intelligence.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                News and analysis on the companies, capital, chips, models, products, and policy decisions moving the AI economy.
              </p>
            </div>
            <Card className="rounded-md border-foreground/15 bg-card py-0 shadow-none">
              <CardContent className="p-5">
                <p className="kicker">Publication</p>
                <div className="mt-4 flex items-center gap-3">
                  <img
                    className="size-14 rounded-full border bg-white object-cover"
                    src={siteConfig.youtubeAvatar}
                    alt="AI Biz News YouTube avatar"
                  />
                  <div>
                    <p className="font-serif text-2xl font-bold">{siteConfig.title}</p>
                    <p className="text-sm text-muted-foreground">Articles by category, with audio and video when available.</p>
                  </div>
                </div>
                <Separator className="my-5" />
                <div className="flex flex-wrap gap-2">
                  <a className={buttonVariants({ variant: "outline", className: "rounded-md" })} href={siteConfig.youtubeUrl}>
                    YouTube <PlayCircle aria-hidden />
                  </a>
                  {siteConfig.tiktokUrl ? (
                    <a className={buttonVariants({ variant: "outline", className: "rounded-md" })} href={siteConfig.tiktokUrl}>
                      TikTok <ArrowUpRight aria-hidden />
                    </a>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="site-shell py-8" id="latest">
        {lead ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_360px]">
            <article className="grid overflow-hidden rounded-md border bg-card md:grid-cols-[minmax(0,1fr)_390px]">
              <Link href={`/articles/${lead.slug}`} aria-label={lead.title}>
                <img
                  className="aspect-[16/9] w-full object-cover object-left md:aspect-auto md:h-full md:min-h-[320px]"
                  src={lead.cover}
                  alt=""
                />
              </Link>
              <div className="flex flex-col p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-sm border-[var(--brand-teal)]/30 text-[var(--brand-teal)]">
                    {lead.category}
                  </Badge>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {formatDate(lead.date)}
                  </span>
                </div>
                <h2 className="mt-4 font-serif text-4xl font-bold leading-tight">
                  <Link href={`/articles/${lead.slug}`}>{lead.title}</Link>
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">{lead.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {lead.tags.slice(0, 5).map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-3 pt-7">
                  <Link className={buttonVariants({ size: "lg", className: "rounded-md" })} href={`/articles/${lead.slug}`}>
                    Read story <ArrowUpRight aria-hidden />
                  </Link>
                  {lead.audioUrl ? (
                    <a className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-md" })} href={lead.audioUrl}>
                      Listen <Headphones aria-hidden />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
            <StoryRail title="Latest" articles={latestRail} />
          </div>
        ) : (
          <Card className="rounded-md">
            <CardContent className="p-8">
              <p className="text-muted-foreground">No articles have been published yet.</p>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="border-y bg-card/55">
        <div className="site-shell py-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Signal label="Companies" value="OpenAI, Nvidia, Microsoft, Google, Anthropic, startups" />
            <Signal label="Markets" value="Cloud spend, chip supply, funding, IPOs, earnings" />
            <Signal label="Products" value="Agents, models, enterprise software, developer platforms" />
            <Signal label="Policy" value="Regulation, safety, copyright, public-sector adoption" />
          </div>
        </div>
      </section>

      <section className="site-shell py-9">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">Sections</p>
            <h2 className="mt-2 font-serif text-4xl font-bold">Browse by category</h2>
          </div>
          <Link className={buttonVariants({ variant: "outline", className: "rounded-md" })} href="/#all-stories">
            All articles <ArrowUpRight aria-hidden />
          </Link>
        </div>
        {categories.length > 0 ? (
          <Tabs defaultValue={defaultCategory} className="gap-5">
            <TabsList variant="line" className="flex flex-wrap justify-start">
              {categories.map((category) => (
                <TabsTrigger key={category.slug} value={category.slug} className="px-3">
                  {category.name} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((category) => {
              const categoryArticles = articles.filter((article) => slugify(article.category) === category.slug).slice(0, 3);
              return (
                <TabsContent key={category.slug} value={category.slug}>
                  <div className="grid gap-4 md:grid-cols-3">
                    {categoryArticles.map((article) => (
                      <ArticleCard article={article} key={article.slug} />
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        ) : null}
      </section>

      <section className="site-shell pb-10" id="all-stories">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="kicker">Index</p>
                <h2 className="mt-2 font-serif text-4xl font-bold">All articles</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {articles.map((article) => (
                <ArticleCard article={article} compact key={article.slug} />
              ))}
            </div>
          </div>
          <aside className="space-y-4">
            <Card className="rounded-md border-foreground/15 py-0 shadow-none">
              <CardContent className="p-5">
                <p className="kicker">Newsletter</p>
                <h3 className="mt-3 font-serif text-2xl font-bold">Get the weekly index.</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  A concise list of the most important AI business stories by category.
                </p>
                <div className="mt-5 flex gap-2">
                  <Input className="rounded-md" placeholder="email@company.com" type="email" />
                  <button className={buttonVariants({ className: "rounded-md" })}>Join</button>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-md border-foreground/15 bg-[var(--brand-ink)] py-0 text-white shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-[var(--brand-gold)]">
                  <Newspaper size={18} />
                  <p className="text-xs font-black uppercase tracking-[0.16em]">Editorial note</p>
                </div>
                <Separator className="my-4 bg-white/20" />
                <p className="font-serif text-2xl font-bold leading-tight">
                  Each article includes category links, related stories, source context, and audio when narration is available.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-teal)]">{label}</p>
      <p className="mt-1 font-serif text-xl font-bold leading-tight">{value}</p>
    </div>
  );
}
