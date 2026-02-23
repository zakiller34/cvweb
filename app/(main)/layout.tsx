import { Navigation } from "@/components/navigation";
import { AnimatedBackground } from "@/components/ui/animated-background";

import { RightSidebar } from "@/components/sidebars/right-sidebar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { getAllSettings } from "@/lib/settings";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Zakaria Teffah",
    jobTitle: "Research & Development Engineer",
    url: "https://www.zakaria-teffah.com",
    image: "https://www.zakaria-teffah.com/profile.jpg",
    email: "zakaria.teffah@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Montpellier",
      addressCountry: "France",
    },
    worksFor: {
      "@type": "Organization",
      name: "NanoXplore",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "INSA Toulouse",
    },
    knowsAbout: [
      "C++",
      "Rust",
      "Python",
      "Compilers",
      "Formal Verification",
      "FPGA",
      "Numerical Optimization",
      "Mathematical Modelling",
      "Lean4",
      "TLA+",
      "SMT Solvers",
    ],
    sameAs: [
      "https://github.com/zakiller34",
      "https://www.linkedin.com/in/zakaria-teffah-8545959a/",
    ],
  },
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { showContactForm, showMailToSidebar, showCvDownload, showPortfolio, showGitHub, showLinkedIn } = getAllSettings();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnimatedBackground />
      <Navigation showContactForm={showContactForm} showCvDownload={showCvDownload} showMailTo={showMailToSidebar} showPortfolio={showPortfolio} showGitHub={showGitHub} showLinkedIn={showLinkedIn} />
      <RightSidebar showContactForm={showContactForm} />
      <ScrollToTop />
      <main className="relative z-10">{children}</main>
    </>
  );
}
