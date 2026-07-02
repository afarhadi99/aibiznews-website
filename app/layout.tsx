import type { Metadata } from "next";
import { Geist, Libre_Baskerville } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
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
    default: "AI Biz News Network",
    template: "%s | AI Biz News Network"
  },
  description:
    "Business-first AI news, short-form video research, market context, and operator-ready analysis.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    siteName: "AI Biz News Network",
    title: "AI Biz News Network",
    description:
      "Business-first AI news, short-form video research, market context, and operator-ready analysis.",
    images: ["/images/covers/default.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Biz News Network",
    description: "Business-first AI news and market context.",
    images: ["/images/covers/default.svg"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(geist.variable, libre.variable)}>
      <body>
        <SiteHeader />
        {children}
        <footer className="border-t bg-primary text-primary-foreground">
          <div className="site-shell grid gap-6 py-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="font-serif text-2xl font-bold">AI Biz News Network</p>
              <p className="mt-2 max-w-2xl text-sm text-primary-foreground/75">
                AI business coverage built for executives, operators, investors, and builders who need the market signal without the noise.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-primary-foreground/75">
              <a href="/#latest">Latest</a>
              <a href="/categories/ai-infrastructure">Infrastructure</a>
              <a href="/categories/ai-platforms">Platforms</a>
              <a href="/categories/ai-markets">Markets</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
