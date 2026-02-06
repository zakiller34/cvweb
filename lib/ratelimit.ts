const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const store = new Map<string, number[]>();

// Periodic cleanup of stale entries
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of store) {
    const valid = timestamps.filter((t) => now - t < WINDOW_MS);
    if (valid.length === 0) {
      store.delete(key);
    } else {
      store.set(key, valid);
    }
  }
}, CLEANUP_INTERVAL_MS);

export async function checkRateLimit(
  identifier: string
): Promise<{ success: boolean; error?: string }> {
  const now = Date.now();
  const timestamps = store.get(identifier) ?? [];
  const valid = timestamps.filter((t) => now - t < WINDOW_MS);

  if (valid.length >= MAX_REQUESTS) {
    store.set(identifier, valid);
    return { success: false };
  }

  valid.push(now);
  store.set(identifier, valid);
  return { success: true };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "127.0.0.1";
  return ip;
}
