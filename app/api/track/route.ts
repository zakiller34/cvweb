import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";
import { trackPageView } from "@/lib/analytics";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success } = await checkRateLimit(`track:${ip}`);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.path !== "string") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const path = body.path as string;
  if (path.startsWith("/admin")) {
    return NextResponse.json({ ok: true });
  }

  trackPageView({
    path,
    referrer: typeof body.referrer === "string" ? body.referrer : undefined,
    userAgent: request.headers.get("user-agent") ?? "",
    ip,
  });

  return NextResponse.json({ ok: true });
}
