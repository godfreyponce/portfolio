import Scene from "@/components/canvas/Scene";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* 3D Background */}
      <Scene />
      
      {/* Sections */}
      <Hero />
    </main>
  );
}