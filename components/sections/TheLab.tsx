import { ArrowUpRight, FlaskConical, Github, Play, Server } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  status: "Live" | "Building" | "Concept";
  link?: string;
  className?: string;
  color?: string;
}

function ProjectCard({ title, description, tags, status, link, className = "", color = "bg-zinc-100" }: ProjectCardProps) {
  return (
    <div className={`relative group rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all hover:shadow-xl flex flex-col overflow-hidden ${className}`}>
      
      {/* Media Placeholder */}
      <div className={`h-48 w-full ${color} relative flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
        {/* Placeholder Icon - Replace with <img> or <video> later */}
        <Play className="text-zinc-400 opacity-50 group-hover:scale-110 transition-transform duration-500" size={48} />
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col grow justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-zinc-900">{title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              status === "Live" ? "bg-green-50 text-green-600 border-green-200" :
              status === "Building" ? "bg-amber-50 text-amber-600 border-amber-200" :
              "bg-zinc-50 text-zinc-500 border-zinc-200"
            }`}>
              {status}
            </span>
          </div>
          
          <p className="text-zinc-500 leading-relaxed text-sm">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-zinc-50 text-zinc-500 text-xs rounded-md border border-zinc-100 font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TheLab() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-24 space-y-12">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-zinc-900 rounded-xl text-white">
          <FlaskConical size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">The Lab</h2>
          <p className="text-zinc-500">Experiments, agents, and open-source ideas.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Project 1: Signal */}
        <ProjectCard 
          title="Signal"
          description="An autonomous AI agent that scouts market trends by scraping, analyzing, and synthesizing competitor data into actionable moodboards."
          tags={["n8n", "Gemini 2.5", "Docker", "Python"]}
          status="Building"
          className="md:col-span-2"
          color="bg-blue-50"
        />

        {/* Project 2: Quartz */}
        <ProjectCard 
          title="Quartz"
          description="A privacy-first, macOS-native productivity tracker inspired by Karpathy's ulogme. Logs active window usage locally for self-reflection."
          tags={["Swift", "SQLite", "Local-First"]}
          status="Concept"
          color="bg-indigo-50"
        />

        {/* Project 3: Juggler Vision */}
        <ProjectCard 
          title="Juggler Vision"
          description="Computer Vision system to track soccer juggling metrics (touch count, body part classification) in real-time using just a camera."
          tags={["OpenCV", "Computer Vision", "ML"]}
          status="Concept"
          color="bg-emerald-50"
        />
        
        {/* GitHub Link Card */}
        <a href="https://github.com/godfreyponce" target="_blank" rel="noopener noreferrer" className="group h-full min-h-[300px] p-8 rounded-3xl bg-zinc-900 text-white flex flex-col justify-center items-center text-center gap-4 hover:bg-zinc-800 transition-colors md:col-span-2 lg:col-span-2 relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <Github size={48} className="text-zinc-400 group-hover:text-white transition-colors relative z-10" />
          <div className="relative z-10">
            <h3 className="text-xl font-bold">View more on GitHub</h3>
            <p className="text-zinc-400 mt-2">Explore my repositories and contributions.</p>
          </div>
        </a>

      </div>
    </section>
  );
}
