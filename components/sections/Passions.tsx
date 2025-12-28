import { Heart, Mountain, Trophy, Play, Server, Terminal } from "lucide-react";

export default function Passions() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-24 space-y-12">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-red-50 text-red-500 rounded-xl">
          <Heart size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Passions</h2>
          <p className="text-zinc-500">Beyond the keyboard.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 h-[500px]">
        {/* Soccer - Large Left Card */}
        <div className="relative group rounded-3xl overflow-hidden bg-zinc-100 md:row-span-2">
          {/* Video Placeholder Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white">
              <Play fill="white" size={24} />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 p-8 z-20">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Trophy size={18} />
              <span className="font-bold tracking-wide uppercase text-xs">Soccer</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">The Beautiful Game</h3>
            <p className="text-zinc-300 text-sm leading-relaxed max-w-md">
              Competitive player and lifelong fan. The teamwork and strategy on the field directly translate to my engineering philosophy.
            </p>
          </div>
          {/* Placeholder Image */}
          <div className="w-full h-full bg-zinc-800 group-hover:scale-105 transition-transform duration-700" />
        </div>

        {/* Snowboarding - Top Right */}
        <div className="relative group rounded-3xl overflow-hidden bg-zinc-100">
           {/* Video Placeholder Overlay */}
           <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white">
              <Play fill="white" size={20} />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 p-8 z-20">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Mountain size={18} />
              <span className="font-bold tracking-wide uppercase text-xs">Snowboarding</span>
            </div>
            <h3 className="text-xl font-bold text-white">Carving Lines</h3>
          </div>
          <div className="w-full h-full bg-zinc-700 group-hover:scale-105 transition-transform duration-700" />
        </div>

        {/* Self-Hosting - Bottom Right */}
        <div className="relative group rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 p-8 flex flex-col justify-between">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Server size={24} />
              <span className="text-xs font-mono bg-emerald-400/10 px-2 py-1 rounded">SYSTEM_ONLINE</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Home Lab</h3>
            <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
              I self host my own infrastructure to avoid paying for subscriptions and to keep my data secure/private.
            </p>
          </div>
          
          <div className="relative z-10 flex gap-3 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400 font-mono">
              <Terminal size={12} />
              <span>~/docker</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400 font-mono">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>n8n active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
