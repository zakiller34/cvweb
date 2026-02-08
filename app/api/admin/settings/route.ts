import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyCsrf, csrfError } from "@/lib/csrf";
import { logger } from "@/lib/logger";
import { getAllSettings } from "@/lib/settings";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getAllSettings();
    return NextResponse.json(settings);
  } catch (err) {
    logger.error({ err }, "GET /api/admin/settings failed");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!verifyCsrf(req)) {
    return csrfError();
  }

  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key || typeof value !== "string") {
      return NextResponse.json(
        { error: "Invalid key or value" },
        { status: 400 }
      );
    }

    const ALLOWED_SETTINGS = ["showCvDownload", "showContactForm", "showMailToSidebar", "showPortfolio", "showScheduleMeeting"] as const;

    if (!ALLOWED_SETTINGS.includes(key as (typeof ALLOWED_SETTINGS)[number])) {
      return NextResponse.json({ error: "Invalid setting key" }, { status: 400 });
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json(setting);
  } catch (err) {
    logger.error({ err }, "POST /api/admin/settings failed");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
