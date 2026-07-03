import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminUsername, isAdminAuthenticated, isAdminConfigured } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const params = await searchParams;
  const configured = isAdminConfigured();
  const errorMessage =
    params.error === "config"
      ? "Admin credentials are not configured yet."
      : params.error === "invalid"
        ? "The username or password was not accepted."
        : "";

  return (
    <main className="site-shell py-10 md:py-16">
      <section className="mx-auto max-w-md rounded-md border border-foreground/15 bg-[var(--brand-surface)] p-5 shadow-[0_18px_52px_rgba(23,23,25,0.08)] dark:border-white/10 dark:bg-white/[0.055]">
        <div className="flex items-center gap-3 border-b border-foreground/10 pb-4 dark:border-white/10">
          <span className="flex size-10 items-center justify-center rounded-md bg-[var(--brand-ink)] text-white dark:bg-white dark:text-[var(--brand-ink)]">
            <LockKeyhole size={19} aria-hidden />
          </span>
          <div>
            <h1 className="font-serif text-2xl font-bold">Admin sign in</h1>
            <p className="text-sm text-muted-foreground dark:text-white/58">Newsletter and site analytics.</p>
          </div>
        </div>

        <form action={loginAction} className="mt-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold" htmlFor="username">Username</label>
            <Input id="username" name="username" required defaultValue={getAdminUsername()} autoComplete="username" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold" htmlFor="password">Password</label>
            <Input id="password" name="password" required type="password" autoComplete="current-password" />
          </div>
          {errorMessage ? (
            <p className="rounded-md border border-[var(--brand-vermilion)]/25 bg-[var(--brand-vermilion)]/10 px-3 py-2 text-sm font-semibold text-[var(--brand-vermilion)]">
              {errorMessage}
            </p>
          ) : null}
          {!configured ? (
            <p className="rounded-md border border-[var(--brand-gold)]/30 bg-[var(--brand-gold)]/12 px-3 py-2 text-sm text-muted-foreground">
              Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in Vercel before using this panel.
            </p>
          ) : null}
          <Button className="w-full rounded-md" disabled={!configured} type="submit">
            Sign in
          </Button>
        </form>
      </section>
    </main>
  );
}
