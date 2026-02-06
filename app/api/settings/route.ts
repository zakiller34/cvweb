import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const showCvSetting = await prisma.setting.findUnique({
      where: { key: "showCvDownload" },
    });

    return NextResponse.json({
      showCvDownload: showCvSetting?.value === "true",
    });
  } catch (err) {
    logger.error({ err }, "GET /api/settings failed");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
