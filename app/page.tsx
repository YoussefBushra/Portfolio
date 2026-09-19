import { TopNav } from "@/components/aws/TopNav";
import { Overview } from "@/components/aws/Overview";
import { About } from "@/components/aws/About";
import { Experience } from "@/components/aws/Experience";
import { Stack } from "@/components/aws/Stack";
import { Contact } from "@/components/aws/Contact";
import { Footer } from "@/components/aws/Footer";

export default function Home() {
  return (
    <>
      <TopNav />
      <main>
        <Overview />
        <div className="mx-auto max-w-[1240px] space-y-4 px-4 pb-8 pt-4 sm:px-6">
          <About />
          <Experience />
          <Stack />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
