import { NextResponse } from "next/server";
import { recordPageEvent } from "@/lib/siteAnalytics";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const start = Date.now();
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const path = typeof data.path === "string" ? data.path : "";

  if (!path.startsWith("/") || path.startsWith("/admin")) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    await recordPageEvent({
      path,
      title: typeof data.title === "string" ? data.title : undefined,
      referrer: typeof data.referrer === "string" ? data.referrer : undefined,
      sessionId: typeof data.sessionId === "string" ? data.sessionId : undefined,
      userAgent: request.headers.get("user-agent")
    });

    console.log(JSON.stringify({ level: "info", message: "page_event_recorded", route: "/api/analytics", ms: Date.now() - start }));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "page_event_failed",
        route: "/api/analytics",
        error: error instanceof Error ? error.message : "Unknown error",
        ms: Date.now() - start
      })
    );

    return NextResponse.json({ error: "Analytics temporarily unavailable." }, { status: 500 });
  }
}
