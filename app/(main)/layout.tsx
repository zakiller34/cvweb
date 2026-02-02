import { Navigation } from "@/components/navigation";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { LeftSidebar } from "@/components/sidebars/left-sidebar";
import { RightSidebar } from "@/components/sidebars/right-sidebar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnimatedBackground />
      <Navigation />
      <LeftSidebar />
      <RightSidebar />
      <ScrollToTop />
      <main className="relative z-10">{children}</main>
    </>
  );
}
