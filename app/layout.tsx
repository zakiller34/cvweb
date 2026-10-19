import type { Metadata } from "next";
import "./globals.css";
import { Agentation } from "agentation";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { ScrollStateProvider } from "@/hooks/use-scroll-state";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.zakaria-teffah.com"),
  title: "Zakaria Teffah - Software Engineer",
  description:
    "CV of Zakaria Teffah, software engineer with 14+ years building robust, high-performance software: architecture, algorithms, optimization and agentic AI.",
  keywords: [
    "Zakaria Teffah",
    "Software Engineer",
    "R&D Engineer",
    "C++",
    "Rust",
    "Python",
    "software architecture",
    "algorithms",
    "optimization",
    "scientific computing",
    "agentic AI",
    "AI agents",
  ],
  alternates: { canonical: "https://www.zakaria-teffah.com" },
  openGraph: {
    title: "Zakaria Teffah - Software Engineer",
    description:
      "14+ years in software engineering: architecture, algorithms, optimization, scientific computing & agentic AI. C++, Python, Rust.",
    url: "https://www.zakaria-teffah.com",
    siteName: "Zakaria Teffah",
    images: [{ url: "/profile.jpg", width: 400, height: 400, alt: "Zakaria Teffah" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Zakaria Teffah - Software Engineer",
    description:
      "14+ years in software engineering: architecture, algorithms, optimization & agentic AI.",
    images: ["/profile.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <ScrollStateProvider>
              {children}
            </ScrollStateProvider>
          </LanguageProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
