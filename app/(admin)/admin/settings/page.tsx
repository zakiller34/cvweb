import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const [showCvSetting, showContactSetting, showMailToSidebarSetting, showPortfolioSetting, showScheduleMeetingSetting] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "showCvDownload" } }),
    prisma.setting.findUnique({ where: { key: "showContactForm" } }),
    prisma.setting.findUnique({ where: { key: "showMailToSidebar" } }),
    prisma.setting.findUnique({ where: { key: "showPortfolio" } }),
    prisma.setting.findUnique({ where: { key: "showScheduleMeeting" } }),
  ]);

  const showCvDownload = showCvSetting?.value === "true";
  const showContactForm = showContactSetting?.value !== "false"; // default true
  const showMailToSidebar = showMailToSidebarSetting?.value !== "false"; // default true
  const showPortfolio = showPortfolioSetting?.value !== "false"; // default true
  const showScheduleMeeting = showScheduleMeetingSetting?.value !== "false"; // default true

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
