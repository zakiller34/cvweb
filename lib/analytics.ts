import { prisma } from "./db";
import { logger } from "./logger";
import crypto from "crypto";
import { UAParser } from "ua-parser-js";

type SecurityEventType = "failed_login" | "rate_limit" | "recaptcha_fail";

const BOT_PATTERN = /bot|crawler|spider|crawling|slurp|mediapartners/i;

export function isBot(ua: string): boolean {
  return BOT_PATTERN.test(ua);
}

export function hashIp(ip: string): string {
  const daySalt = new Date().toISOString().slice(0, 10);
  return crypto
    .createHash("sha256")
    .update(ip + daySalt)
    .digest("hex")
    .slice(0, 16);
}

export function trackSecurityEvent(params: {
  type: SecurityEventType;
  ip: string;
  detail?: string;
  userAgent?: string;
}): void {
  prisma.securityEvent
    .create({
      data: {
        type: params.type,
        ip: params.ip,
        detail: params.detail ?? "",
        userAgent: params.userAgent ?? "",
      },
    })
    .catch((error: unknown) => {
      logger.error({ error }, "failed to track security event");
    });
}

export function trackPageView(params: {
  path: string;
  referrer?: string;
  userAgent?: string;
  ip: string;
}): void {
  const ua = params.userAgent ?? "";
  if (isBot(ua)) return;

  const parser = new UAParser(ua);
  const browser = parser.getBrowser().name ?? "";
  const os = parser.getOS().name ?? "";
  const deviceType = parser.getDevice().type ?? "desktop";

  prisma.pageView
    .create({
      data: {
        path: params.path,
        referrer: params.referrer ?? "",
        browser,
        os,
        device: deviceType,
        ipHash: hashIp(params.ip),
      },
    })
    .catch((error: unknown) => {
      logger.error({ error }, "failed to track page view");
    });
}
