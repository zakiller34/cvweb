import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { ScrollStateProvider } from "@/hooks/use-scroll-state";
import { Navigation } from "@/components/navigation";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { LeftSidebar } from "@/components/sidebars/left-sidebar";
import { RightSidebar } from "@/components/sidebars/right-sidebar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { SessionProvider } from "@/components/session-provider";

export const metadata: Metadata = {
  title: "Zakaria Teffah - Research and Development Engineer",
  description: "CV of Zakaria Teffah, R&D Engineer specializing in compilers, formal verification, and cutting-edge software & hardware development.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <SessionProvider>
          <ThemeProvider>
            <LanguageProvider>
              <ScrollStateProvider>
                <AnimatedBackground />
                <Navigation />
                <LeftSidebar />
                <RightSidebar />
                <ScrollToTop />
                <main className="relative z-10">{children}</main>
              </ScrollStateProvider>
            </LanguageProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
