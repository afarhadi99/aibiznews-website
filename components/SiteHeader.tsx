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
  { href: "/#all-stories", label: "Companies" },
  { href: "/categories/chips-cloud", label: "Chips & Cloud" },
  { href: "/categories/platforms", label: "Platforms" },
  { href: "/categories/policy", label: "Policy" }
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
      <div className="hidden border-b border-foreground/10 dark:border-white/10 md:block">
        <div className="site-shell flex min-h-8 items-center justify-between gap-4 text-xs text-muted-foreground dark:text-white/55">
          <span>Technology reporting for founders, operators, investors, and market watchers</span>
          <span className="font-semibold text-[var(--brand-teal)] dark:text-[var(--brand-gold)]">Companies / Chips / Software / Policy</span>
        </div>
      </div>
      <div className="site-shell">
        <div className="grid min-h-[3.25rem] grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-foreground/15 py-1.5 dark:border-white/10 md:min-h-[4.8rem] md:grid-cols-[1fr_auto_1fr]">
          <div className="flex min-w-0 items-center gap-2">
            <Link href="/" className="flex items-center" aria-label={siteConfig.name}>
              <img
                className="size-8 rounded-full border border-foreground/20 bg-white object-cover dark:border-white/20 md:size-11"
                src={siteConfig.brandImage}
                alt=""
              />
            </Link>
            <div className="hidden min-w-0 md:block">
              <p className="text-xs font-bold text-[var(--brand-teal)] dark:text-[var(--brand-gold)]">Tech business news</p>
              <p className="mt-0.5 max-w-[15rem] truncate text-xs text-muted-foreground dark:text-white/55">{siteConfig.description}</p>
            </div>
          </div>
          <Link href="/" className="justify-self-center font-serif text-2xl font-bold tracking-tight text-foreground dark:text-white sm:text-3xl md:text-4xl">
            {siteConfig.name}
          </Link>
          <div className="flex items-center gap-2 justify-self-end">
            <Button
              aria-label={!mounted ? "Toggle color theme" : theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-full border-foreground/15 bg-white/55 text-foreground hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              onClick={toggleTheme}
              size="icon"
              type="button"
              variant="outline"
            >
              {mounted && theme === "dark" ? <Sun aria-hidden /> : <Moon aria-hidden />}
            </Button>
            <Sheet>
              <SheetTrigger render={<Button className="rounded-full border-foreground/15 bg-white/55 text-foreground hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 lg:hidden" variant="outline" size="icon" aria-label="Open navigation" />}>
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
          <nav className="flex items-center gap-2 text-sm font-semibold text-muted-foreground dark:text-white/62">
            {navItems.map((item) => (
              <Link className="rounded-full px-3 py-1.5 hover:bg-[var(--brand-blush)] hover:text-foreground dark:hover:bg-white/10 dark:hover:text-white" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="h-px bg-foreground/10 dark:bg-white/10">
        <div className="h-full w-[22%] bg-[var(--brand-teal)] dark:bg-[var(--brand-gold)]" />
      </div>
    </header>
  );
}
