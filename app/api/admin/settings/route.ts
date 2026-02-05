import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyCsrf, csrfError } from "@/lib/csrf";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.setting.findMany();

  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!verifyCsrf(req)) {
    return csrfError();
  }

  const body = await req.json();
  const { key, value } = body;

  if (!key || typeof value !== "string") {
    return NextResponse.json(
      { error: "Invalid key or value" },
      { status: 400 }
    );
  }

  const ALLOWED_SETTINGS = ["showCvDownload", "showScheduleMeeting"] as const;

  if (!ALLOWED_SETTINGS.includes(key as (typeof ALLOWED_SETTINGS)[number])) {
    return NextResponse.json({ error: "Invalid setting key" }, { status: 400 });
  }

  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  return NextResponse.json(setting);
}
