"use client";

import { FormEvent, useState } from "react";
import { track } from "@vercel/analytics";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SignupState = "idle" | "loading" | "success" | "error";

type NewsletterSignupProps = {
  source?: string;
};

export function NewsletterSignup({ source = "homepage-sidebar" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SignupState>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, source })
      });

      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Newsletter signup failed.");
      }

      setEmail("");
      setState("success");
      setMessage("You are on the list.");
      track("newsletter_signup", { source });
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Newsletter signup failed.");
    }
  }

  return (
    <form className="mt-5 space-y-3" onSubmit={onSubmit}>
      <div className="flex gap-2">
        <Input
          className="rounded-none border-white/20 bg-white/10 text-white placeholder:text-white/45 focus-visible:border-[var(--brand-gold)]"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email@company.com"
          required
          type="email"
          value={email}
        />
        <Button className="rounded-none bg-[var(--brand-gold)] text-[var(--brand-ink)] hover:bg-[var(--brand-gold)]/86" disabled={state === "loading"} type="submit">
          {state === "loading" ? <Loader2 className="animate-spin" aria-hidden /> : <ArrowRight aria-hidden />}
          <span className="sr-only">Join newsletter</span>
        </Button>
      </div>
      <p
        aria-live="polite"
        className={state === "error" ? "text-sm text-[var(--brand-gold)]" : "text-sm text-white/62"}
      >
        {message || "No spam. Just the technology stories worth tracking."}
      </p>
    </form>
  );
}
