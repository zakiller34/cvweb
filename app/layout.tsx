import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { ScrollStateProvider } from "@/hooks/use-scroll-state";

export const metadata: Metadata = {
  title: "Zakaria Teffah - Research and Development Engineer",
  description: "CV of Zakaria Teffah, R&D Engineer specializing in compilers, formal verification, and cutting-edge software & hardware development.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <ScrollStateProvider>
              {children}
            </ScrollStateProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
