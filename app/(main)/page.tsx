import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Footer } from "@/components/footer";
import { getAllSettings } from "@/lib/settings";

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
  const { showCvDownload, showContactForm, showScheduleMeeting } = await getAllSettings();

  return (
    <>
      <Hero showCvDownload={showCvDownload} showContactForm={showContactForm} showScheduleMeeting={showScheduleMeeting} />
      <About />
      <Experience />
      <Skills />
      <Education />
      {showContactForm && <Contact />}
      <Footer />
    </>
  );
}
