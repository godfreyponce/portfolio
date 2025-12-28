import Scene from "@/components/canvas/Scene";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Timeline from "@/components/sections/Timeline";
import Education from "@/components/sections/Education";

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden">
      {/* 3D Background */}
      <Scene />
      
      {/* Sections */}
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Hero />
          <About />
          <Timeline />
          <Education />
        </div>
      </div>
    </main>
  );
}