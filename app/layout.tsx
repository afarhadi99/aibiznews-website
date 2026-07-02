import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Biz News Network",
  description: "Business-first AI news, short-form video research, and market context."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="shell topbar-inner">
            <Link className="brand" href="/">
              <span className="brand-mark">AI</span>
              <span>AI Biz News Network</span>
            </Link>
            <nav className="nav" aria-label="Main navigation">
              <Link href="/#latest">Latest</Link>
              <Link href="/categories/ai-infrastructure">Infrastructure</Link>
              <Link href="/categories/ai-platforms">Platforms</Link>
              <Link href="/categories/ai-markets">Markets</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="shell">
            AI Biz News Network publishes AI business news articles paired with short-form video coverage.
          </div>
        </footer>
      </body>
    </html>
  );
}
