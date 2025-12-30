import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mx-auto px-6 gap-12 py-32 md:py-48">
      
      {/* Left: Profile Picture */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl shrink-0">
        <Image 
          src="https://github.com/godfreyponce.png" 
          alt="Godfrey Ponce"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right: Text Content */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900">
          Godfrey Ponce
        </h1>
        
        <p className="max-w-xl text-xl md:text-2xl text-zinc-600 font-light leading-relaxed mt-4">
          I like to build agents that think, so we can create
        </p>
      </div>

    </section>
  );
}
