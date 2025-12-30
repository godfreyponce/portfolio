"use client";

export default function About() {
  return (
    <section className="w-full pb-24 space-y-8">
      {/* Full-width Karpathy-style Divider (Darker center) */}
      <div className="w-full h-[1px] mb-8 bg-gradient-to-r from-transparent via-black/75 to-transparent" />
      
      <div className="max-w-3xl mx-auto px-6 space-y-8 mt-8">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 text-center md:text-left">Bio</h2>
        <div className="space-y-6 text-lg text-zinc-600 leading-relaxed">
          <div>
            Hey! I&apos;m a Sophmore Computer Scientist major at <span className="relative group inline-block cursor-help font-medium hover:text-[#e87500] transition-colors duration-200">
              UTD
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 bg-zinc-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                The University of Texas at Dallas
                {/* Tiny Triangle Pointer */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
              </span>
            </span> and I am a builder at heart. I thrive in taking concepts for automation in workflows, engineering it into reality, then seeing it solve a real problem.
          </div>
          <div>
            My approach is grounded in Cognitive Science (my minor) where I study how people think so I can build systems that work intuitively for them. Whether it's architecting autonomous agents or building tools that people actually use, I focus on the human impact of the code I write.
          </div>
          <div>
            This drive comes from the resilience and discipline I&apos;ve built from on the <span className="relative inline-block align-middle group mx-4 h-12 w-20 perspective-1000">
              {/* Vertical Text (Standing Up) */}
              <button 
                onClick={() => {
                  document.getElementById('soccer')?.scrollIntoView({ behavior: 'smooth' });
                  window.dispatchEvent(new CustomEvent('highlight-soccer'));
                }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 font-black text-emerald-700 text-sm uppercase tracking-widest transition-all duration-300 group-hover:text-emerald-500 group-hover:-translate-y-1 drop-shadow-sm"
              >
                field
              </button>
              
              {/* Horizontal Floor (Soccer Field) */}
              <span className="absolute bottom-0 left-0 w-full h-8 transform perspective-1000 rotateX-[70deg] origin-bottom transition-all duration-300 group-hover:rotateX-[60deg]">
                <span className="block w-full h-full bg-emerald-600 border-2 border-white/40 shadow-[0_10px_20px_rgba(0,0,0,0.2)] overflow-hidden">
                  {/* Field Markings */}
                  <span className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_15%,rgba(0,0,0,0.05)_15%,rgba(0,0,0,0.05)_30%)]" />
                  <span className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/40" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/40" />
                </span>
              </span>
            </span>, traits that I translate well over to professional environments. 
          </div>
        </div>
      </div>
    </section>
  );
}