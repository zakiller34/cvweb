import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/db";

// Dynamic imports for below-fold sections (SSR enabled for SEO)
const Experience = dynamic(
  () => import("@/components/sections/experience").then((m) => ({ default: m.Experience })),
  { ssr: true }
);

const Skills = dynamic(
  () => import("@/components/sections/skills").then((m) => ({ default: m.Skills })),
  { ssr: true }
);

const Education = dynamic(
  () => import("@/components/sections/education").then((m) => ({ default: m.Education })),
  { ssr: true }
);

const Contact = dynamic(
  () => import("@/components/sections/contact").then((m) => ({ default: m.Contact })),
  { ssr: true }
);

export default async function Home() {
  const [showCvSetting, hideContactSetting] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "showCvDownload" } }),
    prisma.setting.findUnique({ where: { key: "hideContactForm" } }),
  ]);
  const showCvDownload = showCvSetting?.value !== "false";
  const hideContactForm = hideContactSetting?.value === "true";

  return (
    <>
      <Hero showCvDownload={showCvDownload} hideContactForm={hideContactForm} />
      <About />
      <Experience />
      <Skills />
      <Education />
      {!hideContactForm && <Contact />}
      <Footer />
    </>
  );
}
