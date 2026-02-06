import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, boolean> = {
    db: false,
    resendKey: false,
    recaptcha: false,
  };

  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    checks.db = true;
  } catch {
    // db unreachable
  }

  checks.resendKey = !!process.env.RESEND_API_KEY;
  checks.recaptcha = !!(
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY &&
    process.env.RECAPTCHA_SECRET_KEY
  );

  const healthy = Object.values(checks).every(Boolean);

  return NextResponse.json(
    { status: healthy ? "healthy" : "degraded", checks },
    { status: healthy ? 200 : 503 },
  );
}
