import { handlers } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";
import { trackSecurityEvent } from "@/lib/analytics";
import { NextRequest, NextResponse } from "next/server";

export const GET = handlers.GET;

export async function POST(request: NextRequest) {
  const url = new URL(request.url);

  // Rate limit only credentials login attempts
  if (url.pathname.includes("callback/credentials")) {
    const ip = getClientIp(request);
    const { success } = await checkRateLimit(`auth:${ip}`);
    if (!success) {
      trackSecurityEvent({
        type: "rate_limit",
        ip,
        detail: "auth",
        userAgent: request.headers.get("user-agent") ?? "",
      });
      return NextResponse.json(
        { error: "Too many login attempts. Try again later." },
        { status: 429 }
      );
    }
  }

  return handlers.POST(request);
}
