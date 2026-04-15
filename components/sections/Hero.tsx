import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mx-auto px-6 gap-12 py-32 md:py-48">
      
      {/* Left: Profile Picture */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl shrink-0">
        <Image
          src="/godfrey_headShot.JPG"
          alt="Godfrey Ponce"
          fill
          sizes="(max-width: 768px) 192px, 256px"
          className="object-cover"
          priority
        />
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

        {/* Big Social Footnote */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-10 text-sm md:text-base font-bold text-zinc-500 tracking-[0.2em] uppercase">
          <a href="https://github.com/godfreyponce" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 transition-all hover:translate-y-[-1px]">Github</a>
          <span className="opacity-20 font-light">/</span>
          <a href="https://linkedin.com/in/godfreyponce" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 transition-all hover:translate-y-[-1px]">Linkedin</a>
          <span className="opacity-20 font-light">/</span>
          <a href="mailto:poncegodfrey@gmail.com" className="hover:text-zinc-900 transition-all hover:translate-y-[-1px]">Email</a>
        </div>
      </div>

    </section>
  );
}
