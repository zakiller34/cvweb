import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SettingsForm } from "./settings-form";
import { getAllSettings } from "@/lib/settings";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  let dbAvailable = true;
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbAvailable = false;
    logger.warn("DB unavailable on admin settings page");
  }

  const { showCvDownload, showContactForm, showMailToSidebar, showPortfolio, showScheduleMeeting } = await getAllSettings();

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
          Settings
        </h1>
      </div>

      {!dbAvailable && (
        <div className="mb-6 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-yellow-200">
          Database is unavailable. Showing defaults from environment variables. Changes cannot be saved.
        </div>
      )}

      <SettingsForm
        initialShowCv={showCvDownload}
        initialShowContactForm={showContactForm}
        initialShowMailToSidebar={showMailToSidebar}
        initialShowPortfolio={showPortfolio}
        initialShowScheduleMeeting={showScheduleMeeting}
      />
    </div>
  );
}
