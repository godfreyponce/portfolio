import Image from "next/image";
import LiquidShard from "@/components/ui/LiquidShard";

export default function Hero() {
  return (
    <section className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mx-auto px-6 gap-12 py-32 md:py-48">
      
      {/* Left Group: Profile + Social Shard */}
      <div className="flex items-center gap-4">
        {/* Profile Picture */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl shrink-0">
          <Image 
            src="/godfrey_headShot.JPG" 
            alt="Godfrey Ponce"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Vertical Liquid Shard */}
        <div className="hidden lg:block">
          <LiquidShard />
        </div>
      </div>

      {/* Right: Text Content */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900">
            Godfrey Ponce
          </h1>
        </div>
        
        <p className="max-w-4xl text-lg md:text-2xl text-zinc-600 font-light leading-relaxed">
          I like to build agents that think, so we humans can create
        </p>
      </div>

    </section>
  );
}
