import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const days = Math.min(Number(url.searchParams.get("days")) || 7, 90);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const views = await prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
    });

    // Daily views + unique visitors
    const dailyMap = new Map<string, { views: number; uniqueIps: Set<string> }>();
    for (const v of views) {
      const day = v.createdAt.toISOString().slice(0, 10);
      const entry = dailyMap.get(day) ?? { views: 0, uniqueIps: new Set<string>() };
      entry.views++;
      entry.uniqueIps.add(v.ipHash);
      dailyMap.set(day, entry);
    }
    const daily = Array.from(dailyMap.entries()).map(([date, d]) => ({
      date,
      views: d.views,
      unique: d.uniqueIps.size,
    }));

    // Top pages
    const pageMap = new Map<string, number>();
    for (const v of views) {
      pageMap.set(v.path, (pageMap.get(v.path) ?? 0) + 1);
    }
    const topPages = Array.from(pageMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    // Top referrers
    const refMap = new Map<string, number>();
    for (const v of views) {
      if (v.referrer) {
        refMap.set(v.referrer, (refMap.get(v.referrer) ?? 0) + 1);
      }
    }
    const topReferrers = Array.from(refMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));

    // Browser breakdown
    const browserMap = new Map<string, number>();
    for (const v of views) {
      const b = v.browser || "Unknown";
      browserMap.set(b, (browserMap.get(b) ?? 0) + 1);
    }
    const browsers = Array.from(browserMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    // Device breakdown
    const deviceMap = new Map<string, number>();
    for (const v of views) {
      const d = v.device || "desktop";
      deviceMap.set(d, (deviceMap.get(d) ?? 0) + 1);
    }
    const devices = Array.from(deviceMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    // Unique visitors total
    const allIps = new Set(views.map((v: { ipHash: string }) => v.ipHash));

    return NextResponse.json({
      totalViews: views.length,
      uniqueVisitors: allIps.size,
      daily,
      topPages,
      topReferrers,
      browsers,
      devices,
    });
  } catch (err) {
    logger.error({ err }, "GET /api/admin/analytics/traffic failed");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
