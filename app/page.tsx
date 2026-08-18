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
    <main className="relative w-full overflow-x-clip">
      {/* The lid: opaque page content that slides off the footer pinned beneath it (#39) */}
      <div className="relative z-10 border-b border-rule bg-surface shadow-lid">
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
        </div>
      </div>

      <Footer />
    </main>
  );
}

