import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.message.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
