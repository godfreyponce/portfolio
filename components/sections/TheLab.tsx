"use client";

import { ArrowUpRight, FlaskConical, Github, Play, Server, Radio, QrCode, Timer, Eye, Construction, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  status: "Live" | "Building" | "Concept" | "Hackathon";
  date?: string;
  link?: string;
  githubLink?: string;
  devpostLink?: string;
  videoUrl?: string;
  className?: string;
  color?: string;
  icon?: React.ReactNode;
}

function ProjectCard({ title, description, tags, status, date, link, githubLink, devpostLink, videoUrl, className = "", color = "bg-zinc-100", icon }: ProjectCardProps) {
  // Extract YouTube ID if present
  const youtubeId = videoUrl?.includes("youtube.com") 
    ? new URL(videoUrl).searchParams.get("v") 
    : videoUrl?.includes("youtu.be") 
    ? videoUrl.split("/").pop() 
    : null;

  const isUnderConstruction = status === "Building" || status === "Concept";
  const [isExpanded, setIsExpanded] = useState(false);

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
              {icon && <div className="text-zinc-600 flex-shrink-0 -my-2">{icon}</div>}
              <h3 className="text-2xl font-bold text-zinc-900">{title}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                status === "Live" ? "bg-green-50 text-green-600 border-green-200" :
                status === "Building" ? "bg-amber-50 text-amber-600 border-amber-200" :
                status === "Hackathon" ? "bg-purple-50 text-purple-600 border-purple-200" :
                "bg-zinc-50 text-zinc-500 border-zinc-200"
              }`}>
                {status}
              </span>
            </div>
          </div>
          
          <p className="text-zinc-500 leading-relaxed text-base md:text-lg mt-2">
            {description}
          </p>

          {/* Expandable Links Section - Hover strictly on the button area */}
          {(link || githubLink || devpostLink) && (
            <div 
              className="mt-6 w-fit relative group/container"
              onMouseEnter={() => setIsExpanded(true)}
              onMouseLeave={() => setIsExpanded(false)}
            >
              <button 
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 hover:text-zinc-700 transition-colors group/btn cursor-default"
              >
                View Project 
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5">
                  {isExpanded ? <ChevronUp size={14} /> : <ArrowUpRight size={14} />}
                </span>
              </button>
              
              {/* Invisible Bridge - Fills the gap between button and drawer */}
              <div className="absolute top-full left-0 w-full h-4 z-10" />

              {/* Drawer Container */}
              <div 
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out relative z-20
                  ${isExpanded ? "max-h-80 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}
                `}
              >
                <div className="flex flex-col gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100 shadow-sm">
                  {/* Tech Stack and Date revealed inside drawer - Date on right */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-200/50">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-white text-zinc-500 text-xs rounded-md border border-zinc-100 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {date && <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight ml-auto">{date}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    {githubLink && (
                      <a href={githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-white p-2 rounded-lg transition-all border border-transparent hover:border-zinc-200">
                        <Github size={16} /> GitHub
                      </a>
                    )}
                    {devpostLink && (
                      <a href={devpostLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-white p-2 rounded-lg transition-all border border-transparent hover:border-zinc-200">
                        <FlaskConical size={16} /> Devpost
                      </a>
                    )}
                    {link && (
                       <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-white p-2 rounded-lg transition-all border border-transparent hover:border-zinc-200">
                         <ArrowUpRight size={16} /> Live Demo
                       </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
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
        <p className="text-zinc-500 text-lg">Projects, agents, and open-source ideas.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Project 1: TechAssist */}
        <ProjectCard 
          title="TechAssist"
          description="A smart and efficient native iOS assistant for data center technicians with 'scan-to-solution' QR navigation."
          tags={["SwiftUI", "Auth0", "Figma"]}
          status="Hackathon"
          date="October 2025"
          devpostLink="https://devpost.com/software/techassist"
          githubLink="https://github.com/godfreyponce/TechAssistCLONE"
          videoUrl="https://www.youtube.com/watch?v=RTfW7j82g7E"
          color="bg-orange-50"
          icon={<Image src="/tech_assist.png" alt="TechAssist Logo" width={64} height={64} className="rounded-md" />}
        />

        {/* Project 2: Signal */}
        <ProjectCard 
          title="Signal"
          description="An autonomous AI agent that scouts market trends by scraping, analyzing, and synthesizing competitor data into actionable moodboards."
          tags={["n8n", "Gemini 2.5", "Docker", "Python"]}
          status="Building"
          color="bg-blue-50"
          icon={<Radio size={20} />}
        />

        {/* Project 3: Quartz */}
        <ProjectCard 
          title="Quartz"
          description="Inspired by Karpathy's ulogme, I want to create a modern, macOS-native version that logs active window usage locally for self-reflection."
          tags={["Swift", "SQLite", "Local-First"]}
          status="Concept"
          color="bg-indigo-50"
          icon={<Timer size={20} />}
        />

        {/* Project 3: Juggler Vision */}
        <ProjectCard 
          title="Juggler Vision"
          description="I kept losing track on the # of times I juggle the soccer ball, so I'm going to build an agent that tracks my juggling metrics."
          tags={["OpenCV", "Computer Vision", "ML"]}
          status="Concept"
          color="bg-emerald-50"
          icon={<Eye size={20} />}
        />
        
        {/* GitHub Link Card */}
        <a href="https://github.com/godfreyponce" target="_blank" rel="noopener noreferrer" className="group h-full min-h-[200px] p-8 rounded-3xl bg-zinc-900 text-white flex flex-col justify-center items-center text-center gap-4 hover:bg-zinc-800 transition-colors relative overflow-hidden">
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
