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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--brand-ink)] text-white shadow-[0_1px_0_rgba(255,255,255,0.08)]">
      <div className="site-shell">
        <div className="grid min-h-[3.25rem] grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-white/10 py-1.5 md:min-h-16">
          <Link href="/" className="flex items-center" aria-label={siteConfig.name}>
            <img
              className="size-8 rounded-full border border-white/20 bg-white object-cover md:size-10"
              src={siteConfig.brandImage}
              alt=""
            />
          </Link>
          <Link href="/" className="justify-self-center font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            {siteConfig.name}
          </Link>
          <div className="flex items-center gap-2 justify-self-end">
            <Sheet>
              <SheetTrigger render={<Button className="border-white/25 bg-white/5 text-white hover:bg-white/10 lg:hidden" variant="outline" size="icon" aria-label="Open navigation" />}>
                <Menu />
              </SheetTrigger>
              <SheetContent className="w-[320px] rounded-none bg-[var(--brand-newsprint)]">
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
        <div className="hidden min-h-9 items-center justify-center md:flex">
          <nav className="flex items-center gap-5 text-xs font-black uppercase tracking-[0.14em] text-white/62 lg:gap-7">
            {navItems.map((item) => (
              <Link className="hover:text-white" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
