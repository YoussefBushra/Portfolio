import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { CommandPalette } from "@/components/system/CommandPalette";
import { TechProvider } from "@/components/system/TechContext";

export default function Home() {
  return (
    <TechProvider>
      <CommandPalette />
      <div className="lg:grid lg:grid-cols-[minmax(300px,340px)_minmax(0,1fr)]">
        <Sidebar />
        <main id="hero" className="min-w-0">
          <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Contact />
          </div>
          <Footer />
        </main>
      </div>
    </TechProvider>
  );
}
