import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyCsrf, csrfError } from "@/lib/csrf";
import { logger } from "@/lib/logger";

const RETENTION_DAYS = 90;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!verifyCsrf(request)) {
      return csrfError();
    }

    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

    const [securityDeleted, pageViewsDeleted] = await Promise.all([
      prisma.securityEvent.deleteMany({ where: { createdAt: { lt: cutoff } } }),
      prisma.pageView.deleteMany({ where: { createdAt: { lt: cutoff } } }),
    ]);

    logger.info(
      { securityDeleted: securityDeleted.count, pageViewsDeleted: pageViewsDeleted.count },
      "analytics purge completed"
    );

    return NextResponse.json({
      purged: {
        securityEvents: securityDeleted.count,
        pageViews: pageViewsDeleted.count,
      },
    });
  } catch (err) {
    logger.error({ err }, "POST /api/admin/analytics/purge failed");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
