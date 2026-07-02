import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, BarChart3, CalendarClock, PlayCircle, Radio, Sparkles } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { StoryRail } from "@/components/StoryRail";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllArticleMeta, getCategories, slugify, formatDate } from "@/lib/articles";

export default function HomePage() {
  const articles = getAllArticleMeta();
  const [lead, second, third, ...rest] = articles;
  const categories = getCategories();
  const latestRail = [second, third, ...rest].filter(Boolean).slice(0, 6);
  const defaultCategory = categories[0]?.slug ?? "all";

  return (
    <main>
      <section className="border-b bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0))]">
        <div className="site-shell py-8 md:py-10">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-sm bg-teal-800 text-white">Daily briefing</Badge>
                <Badge variant="outline" className="rounded-sm">AI markets</Badge>
                <Badge variant="outline" className="rounded-sm">Short-video network</Badge>
              </div>
              <h1 className="mt-5 max-w-5xl font-serif text-5xl font-bold leading-[0.98] md:text-7xl">
                Business news for the AI economy.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                AI Biz News turns the day&apos;s AI market signal into articles, video scripts, source-backed context, and platform-ready metadata.
              </p>
            </div>
            <Card className="rounded-md border-foreground/15 bg-primary py-0 text-primary-foreground shadow-none">
              <CardContent className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-primary-foreground/70">
                  Publishing system
                </p>
                <div className="mt-5 grid gap-4">
                  <Metric icon={<CalendarClock size={18} />} label="Daily schedule" value="10 posts" />
                  <Metric icon={<Sparkles size={18} />} label="Visual model" value="Pixio/Nano Banana" />
                  <Metric icon={<Radio size={18} />} label="Channels" value="YouTube + TikTok + Web" />
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
                <img className="h-full min-h-[320px] w-full object-cover" src={lead.cover} alt="" />
              </Link>
              <div className="flex flex-col p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-sm border-teal-700/30 text-teal-800">
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
                    Read lead story <ArrowUpRight aria-hidden />
                  </Link>
                  {lead.youtubeUrl ? (
                    <a className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-md" })} href={lead.youtubeUrl}>
                      Watch short <PlayCircle aria-hidden />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
            <StoryRail title="Market brief" articles={latestRail} />
          </div>
        ) : (
          <Card className="rounded-md">
            <CardContent className="p-8">
              <p className="text-muted-foreground">Run the daily automation to publish the first batch.</p>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="border-y bg-card/55">
        <div className="site-shell py-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Signal label="Research" value="Google News + YouTube trend scan" />
            <Signal label="Video" value="Vertical Shorts and TikTok assets" />
            <Signal label="Article" value="Markdown with featured image metadata" />
            <Signal label="Distribution" value="Studio scheduling and Vercel-ready site" />
          </div>
        </div>
      </section>

      <section className="site-shell py-9">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">Channels</p>
            <h2 className="mt-2 font-serif text-4xl font-bold">Coverage by category</h2>
          </div>
          <Link className={buttonVariants({ variant: "outline", className: "rounded-md" })} href="/#all-stories">
            All stories <ArrowUpRight aria-hidden />
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
                <p className="kicker">Latest feed</p>
                <h2 className="mt-2 font-serif text-4xl font-bold">All reports</h2>
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
                <p className="kicker">Briefing list</p>
                <h3 className="mt-3 font-serif text-2xl font-bold">Get the operator view.</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  The site is ready for newsletter capture once you add an email provider. For now this anchors the publication product.
                </p>
                <div className="mt-5 flex gap-2">
                  <Input className="rounded-md" placeholder="email@company.com" type="email" />
                  <button className={buttonVariants({ className: "rounded-md" })}>Join</button>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-md border-foreground/15 bg-teal-950 py-0 text-white shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-teal-100">
                  <BarChart3 size={18} />
                  <p className="text-xs font-black uppercase tracking-[0.16em]">Editorial rule</p>
                </div>
                <Separator className="my-4 bg-white/20" />
                <p className="font-serif text-2xl font-bold leading-tight">
                  Every video should point back to a source-backed article and every article should point forward to the scheduled short.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 border-t border-primary-foreground/15 pt-4">
      <span className="mt-1 text-teal-200">{icon}</span>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-primary-foreground/60">{label}</p>
        <p className="font-serif text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-800">{label}</p>
      <p className="mt-1 font-serif text-xl font-bold leading-tight">{value}</p>
    </div>
  );
}
