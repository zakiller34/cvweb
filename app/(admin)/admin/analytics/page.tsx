import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AnalyticsDashboard } from "./analytics-dashboard";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin"
          className="text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
        >
          &larr; Admin
        </Link>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Analytics</h1>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
