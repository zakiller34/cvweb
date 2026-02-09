import { Navigation } from "@/components/navigation";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { LeftSidebar } from "@/components/sidebars/left-sidebar";
import { RightSidebar } from "@/components/sidebars/right-sidebar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { getAllSettings } from "@/lib/settings";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { showContactForm, showMailToSidebar, showCvDownload, showPortfolio, showGitHub, showLinkedIn } = getAllSettings();

  return (
    <>
      <AnimatedBackground />
      <Navigation showContactForm={showContactForm} showCvDownload={showCvDownload} showMailTo={showMailToSidebar} showPortfolio={showPortfolio} showGitHub={showGitHub} showLinkedIn={showLinkedIn} />
      <LeftSidebar showMailTo={showMailToSidebar} showPortfolio={showPortfolio} showGitHub={showGitHub} showLinkedIn={showLinkedIn} />
      <RightSidebar showContactForm={showContactForm} />
      <ScrollToTop />
      <main className="relative z-10">{children}</main>
    </>
  );
}
