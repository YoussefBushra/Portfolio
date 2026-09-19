import { GridBackground } from "@/components/premium/GridBackground";
import { CursorGlow } from "@/components/premium/CursorGlow";
import { Nav } from "@/components/premium/Nav";
import { Hero } from "@/components/premium/Hero";
import { Metrics } from "@/components/premium/Metrics";
import { About } from "@/components/premium/About";
import { Experience } from "@/components/premium/Experience";
import { Projects } from "@/components/premium/Projects";
import { Skills } from "@/components/premium/Skills";
import { Contact } from "@/components/premium/Contact";
import { Footer } from "@/components/premium/Footer";

export default function Home() {
  return (
    <>
      <GridBackground />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Metrics />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
