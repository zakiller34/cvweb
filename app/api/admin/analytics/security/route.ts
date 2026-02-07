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

    const events = await prisma.securityEvent.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
    });

    // Counts by type
    const typeCounts: Record<string, number> = {};
    for (const e of events) {
      typeCounts[e.type] = (typeCounts[e.type] ?? 0) + 1;
    }

    // Daily breakdown by type
    const dailyMap = new Map<string, Record<string, number>>();
    for (const e of events) {
      const day = e.createdAt.toISOString().slice(0, 10);
      const entry = dailyMap.get(day) ?? {};
      entry[e.type] = (entry[e.type] ?? 0) + 1;
      dailyMap.set(day, entry);
    }
    const daily = Array.from(dailyMap.entries())
      .map(([date, counts]) => ({ date, ...counts } as { date: string; [key: string]: string | number }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top IPs
    const ipMap = new Map<string, number>();
    for (const e of events) {
      ipMap.set(e.ip, (ipMap.get(e.ip) ?? 0) + 1);
    }
    const topIps = Array.from(ipMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));

    // Recent events (last 50)
    const recent = events.slice(0, 50).map((e) => ({
      id: e.id,
      type: e.type,
      ip: e.ip,
      detail: e.detail,
      createdAt: e.createdAt.toISOString(),
    }));

    return NextResponse.json({
      total: events.length,
      typeCounts,
      daily,
      topIps,
      recent,
    });
  } catch (err) {
    logger.error({ err }, "GET /api/admin/analytics/security failed");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
