import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { MessageList } from "./message-list";

export default async function AdminMessagesPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin"
          className="text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
        >
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Messages
        </h1>
      </div>

      <MessageList initialMessages={messages} />
    </div>
  );
}
