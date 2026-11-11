import LossGraph from "@/components/canvas/LossGraph";
import Hero from "@/components/sections/Hero";
import StickmanRunner from "@/components/StickmanRunner";
import Timeline from "@/components/sections/Timeline";
import Education from "@/components/sections/Education";
import TheLab from "@/components/sections/TheLab";
import Passions from "@/components/sections/Passions";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="relative w-full overflow-x-clip">
      <Hero />
      {/* The lid: opaque page content that slides off the footer pinned beneath it (#39) */}
      <main className="relative z-10 border-b border-rule bg-surface shadow-lid">
        <StickmanRunner />
        <Timeline />
        <Education />
        <LossGraph />
        <TheLab />
        <Passions />
      </main>
      <Footer />
    </div>
  );
}
