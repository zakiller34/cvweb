import { Navigation } from "@/components/navigation";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { LeftSidebar } from "@/components/sidebars/left-sidebar";
import { RightSidebar } from "@/components/sidebars/right-sidebar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { PageTracker } from "@/components/page-tracker";
import { prisma } from "@/lib/db";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const [showContactSetting, showMailToSidebarSetting, showCvDownloadSetting, showPortfolioSetting] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "showContactForm" } }),
    prisma.setting.findUnique({ where: { key: "showMailToSidebar" } }),
    prisma.setting.findUnique({ where: { key: "showCvDownload" } }),
    prisma.setting.findUnique({ where: { key: "showPortfolio" } }),
  ]);
  const showContactForm = showContactSetting?.value !== "false"; // default true
  const showMailToSidebar = showMailToSidebarSetting?.value !== "false"; // default true
  const showCvDownload = showCvDownloadSetting?.value !== "false"; // default true
  const showPortfolio = showPortfolioSetting?.value !== "false"; // default true

  return (
    <>
      <AnimatedBackground />
      <Navigation showContactForm={showContactForm} showCvDownload={showCvDownload} />
      <LeftSidebar showMailTo={showMailToSidebar} showPortfolio={showPortfolio} />
      <RightSidebar showContactForm={showContactForm} />
      <ScrollToTop />
      <PageTracker />
      <main className="relative z-10">{children}</main>
    </>
  );
}
