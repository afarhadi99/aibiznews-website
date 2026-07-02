"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Moon, Sun } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    const savedTheme = window.localStorage.getItem("theme") === "dark" ? "dark" : "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/15 bg-[var(--brand-newsprint)]/95 text-foreground shadow-[0_1px_0_rgba(16,17,20,0.08)] backdrop-blur dark:border-white/10 dark:bg-[var(--brand-ink)]/95 dark:text-white dark:shadow-[0_1px_0_rgba(255,255,255,0.08)]">
      <div className="site-shell">
        <div className="grid min-h-[3.25rem] grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-foreground/15 py-1.5 dark:border-white/10 md:min-h-16">
          <Link href="/" className="flex items-center" aria-label={siteConfig.name}>
            <img
              className="size-8 rounded-full border border-foreground/20 bg-white object-cover dark:border-white/20 md:size-10"
              src={siteConfig.brandImage}
              alt=""
            />
          </Link>
          <Link href="/" className="justify-self-center font-serif text-2xl font-bold tracking-tight text-foreground dark:text-white sm:text-3xl md:text-4xl">
            {siteConfig.name}
          </Link>
          <div className="flex items-center gap-2 justify-self-end">
            <Button
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-md border-foreground/20 bg-transparent text-foreground hover:bg-muted dark:border-white/25 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              onClick={toggleTheme}
              size="icon"
              type="button"
              variant="outline"
            >
              {mounted && theme === "dark" ? <Sun aria-hidden /> : <Moon aria-hidden />}
            </Button>
            <Sheet>
              <SheetTrigger render={<Button className="rounded-md border-foreground/20 bg-transparent text-foreground hover:bg-muted dark:border-white/25 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 lg:hidden" variant="outline" size="icon" aria-label="Open navigation" />}>
                <Menu />
              </SheetTrigger>
              <SheetContent className="w-[320px] rounded-none border-foreground/15 bg-[var(--brand-newsprint)] dark:border-white/10 dark:bg-[var(--brand-ink)]">
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
          <nav className="flex items-center gap-5 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground dark:text-white/62 lg:gap-7">
            {navItems.map((item) => (
              <Link className="hover:text-foreground dark:hover:text-white" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
