import SimpleBackground from "@/components/canvas/SimpleBackground";
import LossGraph from "@/components/canvas/LossGraph";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import StickmanRunner from "@/components/StickmanRunner";
import Timeline from "@/components/sections/Timeline";
import Education from "@/components/sections/Education";
import TheLab from "@/components/sections/TheLab";
import Passions from "@/components/sections/Passions";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden">
      <div className="relative">
        <SimpleBackground />
        <Hero />
      </div>

      <div className="relative z-10">
        <About />
        <StickmanRunner />
        <Timeline />
        <Education />
        <LossGraph />
        <TheLab />
        <Passions />
        <Footer />
      </div>
    </main>
  );
}

