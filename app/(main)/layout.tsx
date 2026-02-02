import { Navigation } from "@/components/navigation";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { LeftSidebar } from "@/components/sidebars/left-sidebar";
import { RightSidebar } from "@/components/sidebars/right-sidebar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { prisma } from "@/lib/db";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const [hideContactSetting, showMailToSidebarSetting] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "hideContactForm" } }),
    prisma.setting.findUnique({ where: { key: "showMailToSidebar" } }),
  ]);
  const hideContactForm = hideContactSetting?.value === "true";
  const showMailToSidebar = showMailToSidebarSetting?.value !== "false"; // default true

  return (
    <>
      <AnimatedBackground />
      <Navigation hideContactForm={hideContactForm} />
      <LeftSidebar showMailTo={showMailToSidebar} />
      <RightSidebar />
      <ScrollToTop />
      <main className="relative z-10">{children}</main>
    </>
  );
}
