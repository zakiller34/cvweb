import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
import { getAllSettings } from "@/lib/settings";

export default function Home() {
  const { showCvDownload, showContactForm, showScheduleMeeting, showMailToSidebar, showPortfolio, showGitHub, showLinkedIn } = getAllSettings();

  return (
    <>
      <Hero showCvDownload={showCvDownload} showContactForm={showContactForm} showScheduleMeeting={showScheduleMeeting} showMailTo={showMailToSidebar} showPortfolio={showPortfolio} showGitHub={showGitHub} showLinkedIn={showLinkedIn} />
      <About />
      <Experience />
      <Skills />
      <Education />
      {showContactForm && <Contact />}
      <Footer />
    </>
  );
}
