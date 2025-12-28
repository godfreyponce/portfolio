import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative z-10 flex flex-col md:flex-row items-center justify-center min-h-screen w-full max-w-5xl mx-auto px-6 gap-12">
      
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
      <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
        <div className="space-y-2">
          {/* <h2 className="text-xl md:text-2xl font-medium text-zinc-500 tracking-wide">
            Hello, I&apos;m
          </h2> */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900">
            Godfrey Ponce
          </h1>
        </div>
        
        <p className="max-w-md text-lg text-zinc-600 leading-relaxed">
          Student Web Developer & Engineer. Passionate about building minimal, functional, and intelligent web experiences.
        </p>

        <div className="flex gap-4 pt-4">
          <button className="px-6 py-3 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition-colors">
            View Projects
          </button>
          <button className="px-6 py-3 border border-zinc-300 text-zinc-700 rounded-full font-medium hover:bg-zinc-100 transition-colors">
            Contact Me
          </button>
        </div>
      </div>

    </section>
  );
}
