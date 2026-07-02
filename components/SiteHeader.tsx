"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
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
  { href: "/categories/ai-markets", label: "Markets" },
  { href: "/categories/ai-infrastructure", label: "Infrastructure" },
  { href: "/categories/ai-platforms", label: "Platforms" },
  { href: "/categories/ai-policy", label: "Policy" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-foreground/15 bg-[var(--brand-newsprint)]/95 backdrop-blur">
      <div className="site-shell">
        <div className="grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-foreground/10 md:min-h-20">
          <Link href="/" className="flex items-center" aria-label={siteConfig.name}>
            <img
              className="size-10 rounded-full border border-foreground/15 bg-white object-cover md:size-12"
              src={siteConfig.brandImage}
              alt=""
            />
          </Link>
          <Link href="/" className="justify-self-center font-serif text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl">
            {siteConfig.name}
          </Link>
          <div className="flex items-center gap-2 justify-self-end">
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
