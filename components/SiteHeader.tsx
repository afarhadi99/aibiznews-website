"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

const navItems = [
  { href: "/#latest", label: "Top Stories" },
  { href: "/categories/ai-infrastructure", label: "Infrastructure" },
  { href: "/categories/ai-platforms", label: "Platforms" },
  { href: "/categories/ai-automation", label: "Automation" },
  { href: "/categories/ai-markets", label: "Markets" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="site-shell">
        <div className="grid min-h-20 grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-foreground/10">
          <Link href="/" className="flex items-center gap-3">
            <img
              className="size-12 rounded-full border border-foreground/15 bg-white object-cover"
              src={siteConfig.brandImage}
              alt="AI Biz News logo"
            />
            <span className="hidden font-serif text-2xl font-bold leading-none sm:inline">
              {siteConfig.title}
            </span>
          </Link>
          <Link href="/" className="justify-self-center font-serif text-3xl font-bold tracking-tight md:text-5xl">
            {siteConfig.name}
          </Link>
          <div className="flex items-center gap-2 justify-self-end">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search />
            </Button>
            <Sheet>
              <SheetTrigger render={<Button className="lg:hidden" variant="outline" size="icon" aria-label="Open navigation" />}>
                <Menu />
              </SheetTrigger>
              <SheetContent className="w-[320px] rounded-none">
                <SheetHeader>
                  <SheetTitle>{siteConfig.title}</SheetTitle>
                </SheetHeader>
                <nav className="grid gap-1 px-4 pb-6">
                  {navItems.map((item) => (
                    <Link className="rounded-md px-3 py-3 text-sm font-semibold hover:bg-muted" href={item.href} key={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="flex min-h-10 items-center justify-center">
          <nav className="hidden items-center gap-6 text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground lg:flex">
            {navItems.map((item) => (
              <Link className="hover:text-foreground" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
