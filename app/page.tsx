import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { HeroSwitch } from "@/components/sections/HeroSwitch";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { CommandPalette } from "@/components/system/CommandPalette";

export default function Home() {
  return (
    <>
      <CommandPalette />
      <Nav />
      <main>
        <HeroSwitch />
        <About />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
