import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Zakaria Teffah - Senior C++ Engineer",
  description: "Portfolio and CV of Zakaria Teffah, Senior C++ Engineer specializing in compilers, formal verification, and cutting-edge software development.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <Navigation />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
