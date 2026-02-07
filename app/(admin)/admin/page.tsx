import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { HealthStatus } from "./health-status";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  // Get stats
  const [messageCount, unreadCount] = await Promise.all([
    prisma.message.count(),
    prisma.message.count({ where: { read: false } }),
  ]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
          >
            &larr; Site
          </Link>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Admin
          </h1>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-[var(--card-bg)] border border-[var(--border)] rounded-md hover:bg-[var(--border)]"
          >
            Sign Out
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            Messages
          </h2>
          <p className="text-3xl font-bold text-[var(--accent)]">
            {messageCount}
          </p>
          <p className="text-sm text-[var(--foreground)]/60">
            {unreadCount} unread
          </p>
        </div>

        <div className="p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            Site Settings
          </h2>
          <p className="text-sm text-[var(--foreground)]/60">
            Control CV visibility and more
          </p>
        </div>

        <HealthStatus />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/messages"
          className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
        >
          <span className="font-medium text-[var(--foreground)]">
            View Messages
          </span>
          <span className="block text-sm text-[var(--foreground)]/60 mt-1">
            Read and manage contact form submissions
          </span>
        </Link>

        <Link
          href="/admin/settings"
          className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
        >
          <span className="font-medium text-[var(--foreground)]">
            Site Settings
          </span>
          <span className="block text-sm text-[var(--foreground)]/60 mt-1">
            Toggle CV download buttons and more
          </span>
        </Link>

        <Link
          href="/admin/analytics"
          className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
        >
          <span className="font-medium text-[var(--foreground)]">
            Analytics
          </span>
          <span className="block text-sm text-[var(--foreground)]/60 mt-1">
            Traffic, security events, and trends
          </span>
        </Link>
      </div>
    </div>
  );
}
