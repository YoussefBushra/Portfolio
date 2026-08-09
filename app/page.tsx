import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { CommandPalette } from "@/components/system/CommandPalette";
import { BootSequence } from "@/components/system/BootSequence";
import { Minimap } from "@/components/system/Minimap";
import { TechProvider } from "@/components/system/TechContext";

export default function Home() {
  return (
    <TechProvider>
      <BootSequence />
      <CommandPalette />
      <Minimap />
      <Nav />
      <main>
        <Hero />
        {/* faint blueprint grid behind the content sections */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 bp-grid opacity-40" />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </div>
      </main>
      <Footer />
    </TechProvider>
  );
}
