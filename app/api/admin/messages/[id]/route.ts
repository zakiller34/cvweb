import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyCsrf, csrfError } from "@/lib/csrf";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!verifyCsrf(req)) {
    return csrfError();
  }

  try {
    const { id } = await params;
    const body = await req.json();

    if (typeof body.read !== "boolean") {
      return NextResponse.json({ error: "Invalid read value" }, { status: 400 });
    }

    const message = await prisma.message.update({
      where: { id },
      data: { read: body.read },
    });

    return NextResponse.json(message);
  } catch (err) {
    logger.error({ err }, "PATCH /api/admin/messages/[id] failed");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!verifyCsrf(req)) {
    return csrfError();
  }

  try {
    const { id } = await params;

    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error({ err }, "DELETE /api/admin/messages/[id] failed");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
