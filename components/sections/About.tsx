"use client";

// import MiniSoccerField from "@/components/canvas/MiniSoccerField";



export default function About() {

  return (

    <section className="w-full pb-24 space-y-8">

      {/* Full-width Karpathy-style Divider (Darker center) */}

      <div className="w-full h-[1px] mb-8 bg-gradient-to-r from-transparent via-black/75 to-transparent" />

      

      <div className="max-w-3xl mx-auto px-6 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 text-left">Bio</h2>
        <div className="mt-6 space-y-6 text-base md:text-lg text-zinc-600 leading-relaxed text-left">
          <div>
            Hey! I&apos;m a Sophmore Computer Scientist major at <span className="relative group inline-block cursor-help font-medium text-zinc-900 underline decoration-zinc-200 hover:decoration-[#e87500] hover:text-[#e87500] transition-colors duration-200">
              UTD
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 bg-zinc-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                The University of Texas at Dallas
                {/* Tiny Triangle Pointer */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
              </span>
            </span> and I am a builder at heart. I thrive in taking concepts for automation in workflows, engineering it into reality, then seeing it solve a real problem.
          </div>
          <div>
            My approach is grounded in Cognitive Science (my minor) where I study how people think so I can build systems that work intuitively for them. Whether it&apos;s architecting autonomous agents or building tools that people actually use, I focus on the human impact of the code I write.
          </div>
          <div>
            This drive comes from the resilience and discipline I&apos;ve built from on the <button 
              onClick={() => {
                document.getElementById('soccer')?.scrollIntoView({ behavior: 'smooth' });
                window.dispatchEvent(new CustomEvent('highlight-soccer'));
              }}
              style={{ cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" style=\"font-size: 24px\"><text y=\"20\">⚽</text></svg>'), auto" }}
              className="font-medium text-zinc-900 underline decoration-zinc-200 hover:text-emerald-600 hover:decoration-emerald-600 transition-all duration-200"
            >
              field
            </button>, traits that I translate well over to professional environments. 
          </div>
        </div>
      </div>

      

      

    </section>

  );

}
