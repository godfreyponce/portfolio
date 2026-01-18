import SimpleBackground from "@/components/canvas/SimpleBackground";
import LossGraph from "@/components/canvas/LossGraph";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Timeline from "@/components/sections/Timeline";
import Education from "@/components/sections/Education";
import TheLab from "@/components/sections/TheLab";
import Passions from "@/components/sections/Passions";
import Footer from "@/components/sections/Footer";
import LightSwitch from "@/components/ui/LightSwitch";

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden">
      {/* Hero with Soft Background */}
      <div className="relative">
        <SimpleBackground />
        <Hero />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 bg-white/50 backdrop-blur-3xl">
        <About />
        <Timeline />
        
        {/* Education & Switch row */}
        <div className="relative w-full">
          <Education />
          {/* <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 shrink-0">
            <LightSwitch />
          </div> */}
        </div>

        {/* Convergence Graph as a Connector between Foundation and Output */}
        <LossGraph />

        <TheLab />
        <Passions />
        <Footer />
      </div>
    </main>
  );
}
