import { NextResponse } from "next/server";
import { isValidEmail, normalizeEmail, saveNewsletterSignup } from "@/lib/newsletter";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const email = normalizeEmail(String(data.email ?? ""));
  const source = typeof data.source === "string" ? data.source : "site";

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await saveNewsletterSignup({
      email,
      source,
      userAgent: request.headers.get("user-agent")
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Newsletter signup failed.";
    const isMissingDatabase = message.includes("DATABASE_URL") || message.includes("POSTGRES_URL");

    return NextResponse.json(
      {
        error: isMissingDatabase
          ? "Newsletter signup is not connected to Postgres yet."
          : "Newsletter signup is temporarily unavailable."
      },
      { status: isMissingDatabase ? 503 : 500 }
    );
  }
}
