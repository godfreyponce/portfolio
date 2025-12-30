import { ArrowUpRight, FlaskConical, Github, Play, Server, Radio, QrCode, Timer, Eye, Construction } from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  status: "Live" | "Building" | "Concept" | "Hackathon";
  link?: string;
  videoUrl?: string;
  className?: string;
  color?: string;
  icon?: React.ReactNode;
}

function ProjectCard({ title, description, tags, status, link, videoUrl, className = "", color = "bg-zinc-100", icon }: ProjectCardProps) {
  // Extract YouTube ID if present
  const youtubeId = videoUrl?.includes("youtube.com") 
    ? new URL(videoUrl).searchParams.get("v") 
    : videoUrl?.includes("youtu.be") 
    ? videoUrl.split("/").pop() 
    : null;

  const isUnderConstruction = status === "Building" || status === "Concept";

  return (
    <div className={`relative group rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all hover:shadow-xl flex flex-col overflow-hidden ${className}`}>
      
      {/* Media Placeholder or Video - 16:9 Aspect Ratio */}
      <div className={`aspect-video w-full ${color} relative flex items-center justify-center overflow-hidden`}>
        {/* Horizontal Construction Tape Overlay */}
        {isUnderConstruction && (
          <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
            <div className="w-full bg-yellow-400 text-black py-1.5 font-black text-[10px] tracking-[0.3em] uppercase shadow-sm border-y border-black/10 text-center -rotate-2">
              UNDER CONSTRUCTION • UNDER CONSTRUCTION • UNDER CONSTRUCTION
            </div>
          </div>
        )}

        {youtubeId ? (
          <iframe 
            className="w-full h-full border-0"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=1&controls=1&loop=1&playlist=${youtubeId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="relative flex flex-col items-center gap-4">
            {/* Removed gray hover background (bg-black/5) */}
            {isUnderConstruction ? (
              <div className="flex flex-col items-center gap-3 text-zinc-400 relative z-10">
                <Construction size={48} className="animate-bounce" />
                <span className="text-xs font-mono uppercase tracking-tighter opacity-50">Drafting System...</span>
              </div>
            ) : icon ? (
               <div className="text-zinc-400 opacity-50 group-hover:scale-110 transition-transform duration-500 transform scale-150">
                 {icon}
               </div>
            ) : (
               <Play className="text-zinc-400 opacity-50 group-hover:scale-110 transition-transform duration-500" size={48} />
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-8 py-6 flex flex-col grow justify-between">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Removed grey background and increased size */}
              {icon && <div className="text-zinc-600 flex-shrink-0 -my-2">{icon}</div>}
              <h3 className="text-2xl font-bold text-zinc-900">{title}</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              status === "Live" ? "bg-green-50 text-green-600 border-green-200" :
              status === "Building" ? "bg-amber-50 text-amber-600 border-amber-200" :
              status === "Hackathon" ? "bg-purple-50 text-purple-600 border-purple-200" :
              "bg-zinc-50 text-zinc-500 border-zinc-200"
            }`}>
              {status}
            </span>
          </div>
          
          <p className="text-zinc-500 leading-relaxed text-base md:text-lg mt-2">
            {description}
          </p>

          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 hover:underline pt-2">
              View Project <ArrowUpRight size={14} />
            </a>
          )}
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
    <section className="w-full max-w-3xl mx-auto px-6 py-24 space-y-12">
      <div className="flex flex-col items-center text-center gap-2">
        <h2 className="text-3xl font-bold text-zinc-900">The Lab</h2>
        <p className="text-zinc-500 text-lg">Projects, agents, and open-source ideas</p>
      </div>

              {/* Project 2: TechAssist */}
              <ProjectCard 
                title="TechAssist"
                description="HackUTD 2025 Winner. A native iOS assistant for data center technicians with 'scan-to-solution' QR navigation."
                tags={["SwiftUI", "Auth0", "Figma"]}
                status="Hackathon"
                link="https://devpost.com/software/techassist"
                videoUrl="https://www.youtube.com/watch?v=RTfW7j82g7E"
                color="bg-orange-50"
                icon={<Image src="/tech_assist.png" alt="TechAssist Logo" width={100} height={75} className="rounded-md" />}
              />
      <div className="flex flex-col gap-6">
        {/* Project 1: Signal */}
        <ProjectCard 
          title="Signal"
          description="An autonomous AI agent that scouts market trends by scraping, analyzing, and synthesizing competitor data into actionable moodboards"
          tags={["n8n", "Gemini 2.5", "Docker", "Python"]}
          status="Building"
          color="bg-blue-50"
          icon={<Radio size={20} />}
        />

        

        {/* Project 3: Quartz */}
        <ProjectCard 
          title="Quartz"
          description="Inspired by Karpathy's ulogme, I wanted to create a modern, macOS-native version that logs active window usage locally for self-reflection"
          tags={["Swift", "SQLite", "Local-First"]}
          status="Concept"
          color="bg-indigo-50"
          icon={<Timer size={20} />}
        />

        {/* Project 3: Juggler Vision */}
        <ProjectCard 
          title="Juggler Vision"
          description="I lose count when I juggle my soccer ball so I want to build an app that can just track and keep count for me"
          tags={["OpenCV", "Computer Vision", "ML"]}
          status="Concept"
          color="bg-emerald-50"
          icon={<Eye size={20} />}
        />
        
        {/* GitHub Link Card */}
        <a href="https://github.com/godfreyponce" target="_blank" rel="noopener noreferrer" className="group h-full min-h-[200px] p-8 rounded-3xl bg-zinc-900 text-white flex flex-col justify-center items-center text-center gap-4 hover:bg-zinc-800 transition-colors relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <Github size={48} className="text-zinc-400 group-hover:text-white transition-colors relative z-10" />
          <div className="relative z-10">
            <h3 className="text-xl font-bold">View more on GitHub</h3>
            <p className="text-zinc-400 mt-2">Explore my repositories and contributions</p>
          </div>
        </a>

      </div>
    </section>
  );
}
