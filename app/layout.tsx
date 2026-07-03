import type { Metadata } from "next";
import { Geist, Libre_Baskerville } from "next/font/google";
import { PageAnalytics } from "@/components/PageAnalytics";
import { SiteHeader } from "@/components/SiteHeader";
import { VercelAnalytics } from "@/components/VercelAnalytics";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const libre = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"]
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aibiznews.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.title,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.brandImage]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.brandImage]
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(geist.variable, libre.variable)} suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}`
          }}
        />
        <SiteHeader />
        {children}
        <PageAnalytics />
        <VercelAnalytics />
        <footer className="border-t border-foreground/15 bg-[var(--brand-ink)] text-white dark:border-white/10">
          <div className="site-shell grid gap-6 py-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="font-serif text-2xl font-bold">{siteConfig.name}</p>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Articles and market context on the companies, infrastructure, products, security issues, and policies shaping technology.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
              <a href="/#latest">Latest</a>
              <a href="/categories/chips-cloud">Chips & Cloud</a>
              <a href="/categories/platforms">Platforms</a>
              <a href="/categories/markets-policy">Markets</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
