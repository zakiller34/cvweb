import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { ScrollStateProvider } from "@/hooks/use-scroll-state";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.zakaria-teffah.com"),
  title: "Zakaria Teffah - Research and Development Engineer",
  description:
    "CV of Zakaria Teffah, R&D Engineer specializing in compilers, formal verification, and cutting-edge software & hardware development.",
  keywords: [
    "Zakaria Teffah",
    "R&D Engineer",
    "C++",
    "Rust",
    "Python",
    "compilers",
    "formal verification",
    "FPGA",
    "optimization",
    "scientific computing",
    "Lean4",
    "TLA+",
    "SMT solvers",
  ],
  alternates: { canonical: "https://www.zakaria-teffah.com" },
  openGraph: {
    title: "Zakaria Teffah - R&D Engineer",
    description:
      "14+ years in compilers, formal verification, optimization & scientific computing. C++, Rust, Python, Lean4, TLA+.",
    url: "https://www.zakaria-teffah.com",
    siteName: "Zakaria Teffah",
    images: [{ url: "/profile.jpg", width: 400, height: 400, alt: "Zakaria Teffah" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Zakaria Teffah - R&D Engineer",
    description:
      "14+ years in compilers, formal verification, optimization & scientific computing.",
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
      </body>
    </html>
  );
}
