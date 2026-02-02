import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const showCvSetting = await prisma.setting.findUnique({
    where: { key: "showCvDownload" },
  });

  return NextResponse.json({
    showCvDownload: showCvSetting?.value === "true",
  });
}
