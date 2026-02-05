import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRatelimit() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  const redis = new Redis({ url, token });

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
  });
}

const ratelimit = createRatelimit();

export async function checkRateLimit(
  identifier: string
): Promise<{ success: boolean; error?: string }> {
  if (!ratelimit) {
    // Fail closed: block if not configured
    return { success: false, error: "Rate limiter not configured" };
  }

  try {
    const { success } = await ratelimit.limit(identifier);
    return { success };
  } catch (err) {
    console.error("Rate limit check failed:", err);
    // Fail closed
    return { success: false, error: "Rate limit service unavailable" };
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "127.0.0.1";
  return ip;
}
