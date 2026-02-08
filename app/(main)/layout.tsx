import { Navigation } from "@/components/navigation";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { LeftSidebar } from "@/components/sidebars/left-sidebar";
import { RightSidebar } from "@/components/sidebars/right-sidebar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { PageTracker } from "@/components/page-tracker";
import { getAllSettings } from "@/lib/settings";

export const revalidate = 3600;

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const { showContactForm, showMailToSidebar, showCvDownload, showPortfolio, showGitHub, showLinkedIn } = await getAllSettings();

  return (
    <>
      <AnimatedBackground />
      <Navigation showContactForm={showContactForm} showCvDownload={showCvDownload} showMailTo={showMailToSidebar} showPortfolio={showPortfolio} showGitHub={showGitHub} showLinkedIn={showLinkedIn} />
      <LeftSidebar showMailTo={showMailToSidebar} showPortfolio={showPortfolio} showGitHub={showGitHub} showLinkedIn={showLinkedIn} />
      <RightSidebar showContactForm={showContactForm} />
      <ScrollToTop />
      <PageTracker />
      <main className="relative z-10">{children}</main>
    </>
  );
}
