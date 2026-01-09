"use client";

import { ArrowUpRight, FlaskConical, Github, Play, Server, Radio, QrCode, Timer, Eye, Construction, ChevronDown, ChevronUp, Lock, Unlock } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

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
  isSecret?: boolean;
}

function ProjectCard({ title, description, tags, status, date, link, githubLink, devpostLink, videoUrl, className = "", color = "bg-zinc-100", icon, isSecret }: ProjectCardProps) {
  const youtubeId = videoUrl?.includes("youtube.com") 
    ? new URL(videoUrl).searchParams.get("v") 
    : videoUrl?.includes("youtu.be") 
    ? videoUrl.split("/").pop() 
    : null;

  const isUnderConstruction = status === "Building" || status === "Concept";
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(false);

  // The actual description for Quartz is moved here to be "internal"
  const quartzIntel = "Inspired by Karpathy's ulogme, I wanted to create a modern, macOS-native version that logs active window usage locally for self-reflection.";
  
  const displayDesc = isSecret && !isDecrypted 
    ? "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••" 
    : isSecret ? quartzIntel : description;

  return (
    <div className={`relative group rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500 hover:shadow-xl flex flex-col overflow-hidden ${className}`}>
      
      <div className={`aspect-video w-full ${color} dark:bg-zinc-800 relative flex items-center justify-center overflow-hidden transition-colors duration-500`}>
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
              <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500 relative z-10">
                <Construction size={48} className="animate-bounce" />
                <span className="text-xs font-mono uppercase tracking-tighter opacity-50 text-center">
                    {isSecret && !isDecrypted ? "System Encrypted" : "Drafting System..."}
                </span>
              </div>
            ) : icon ? (
               <div className="text-zinc-400 dark:text-zinc-500 opacity-50 group-hover:scale-110 transition-transform duration-500 transform scale-150">
                 {icon}
               </div>
            ) : (
               <Play className="text-zinc-400 dark:text-zinc-500 opacity-50 group-hover:scale-110 transition-transform duration-500" size={48} />
            )}
          </div>
        )}
      </div>

      <div className="px-8 py-6 flex flex-col grow justify-between">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {icon && <div className="text-zinc-600 dark:text-zinc-400 flex-shrink-0 -my-2">{icon}</div>}
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                status === "Live" ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800" :
                status === "Building" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800" :
                status === "Hackathon" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800" :
                "bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
              } transition-colors duration-500`}>
                {status}
              </span>
            </div>
          </div>
          
          <div className="relative">
            <p className={`text-zinc-500 dark:text-zinc-400 leading-relaxed text-base md:text-lg mt-2 ${isSecret && !isDecrypted ? "select-none blur-sm opacity-30" : ""}`}>
                {displayDesc}
            </p>
            {isSecret && !isDecrypted && (
                <button 
                    onClick={() => setIsDecrypted(true)}
                    className="absolute inset-0 flex items-center justify-center gap-2 bg-zinc-900/5 hover:bg-zinc-900/10 rounded-xl transition-all border border-zinc-200 border-dashed group/secret"
                >
                    <Lock size={16} className="text-zinc-400 group-hover/secret:text-zinc-900 transition-colors" />
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Decrypt Project Intel</span>
                </button>
            )}
          </div>

          {(link || githubLink || devpostLink) && (
            <div 
              className="mt-6 w-fit relative group/container"
              onMouseEnter={() => setIsExpanded(true)}
              onMouseLeave={() => setIsExpanded(false)}
            >
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors group/btn"
                >
                  View Project 
                  <span className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5">
                    {isExpanded ? <ChevronUp size={14} /> : <ArrowUpRight size={14} />}
                  </span>
                </button>
              </div>
              
              <div className="absolute top-full left-0 w-full h-4 z-10" />

              <div 
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out relative z-20
                  ${isExpanded ? "max-h-80 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}
                `}
              >
                <div className="flex flex-col gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm transition-colors duration-500">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-200/50 dark:border-zinc-700/50">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 text-xs rounded-md border border-zinc-100 dark:border-zinc-700 font-medium transition-colors duration-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {date && <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight ml-auto">{date}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    {githubLink && (
                      <a href={githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-900 p-2 rounded-lg transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
                        <Github size={16} /> GitHub
                      </a>
                    )}
                    {devpostLink && (
                      <a href={devpostLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-900 p-2 rounded-lg transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
                        <FlaskConical size={16} /> Devpost
                      </a>
                    )}
                    {link && (
                       <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-900 p-2 rounded-lg transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
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
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">The Lab</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">Experiments, agents, and open-source ideas.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Project 1: TechAssist */}
        <ProjectCard 
          title="TechAssist"
          description="A native iOS assistant for data center technicians with 'scan-to-solution' QR navigation."
          tags={["SwiftUI", "Auth0", "Figma"]}
          status="Hackathon"
          date="October 2025"
          devpostLink="https://devpost.com/software/techassist"
          githubLink="https://github.com/godfreyponce/TechAssistCLONE"
          videoUrl="https://www.youtube.com/watch?v=RTfW7j82g7E"
          color="bg-orange-50"
          icon={<Image src="/tech_assist.png" alt="TechAssist Logo" width={100} height={100} className="rounded-md" />}
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
          description="" // Empty string to hide it from props
          tags={["Swift", "SQLite", "Local-First"]}
          status="Concept"
          isSecret={true}
          color="bg-indigo-50"
          icon={<Timer size={20} />}
        />

        {/* Project 4: Juggler Vision */}
        <ProjectCard 
          title="Juggler Vision"
          description="I kept losing track on the # of times I juggle the soccer ball, so I'm going to build an agent that tracks my juggling metrics."
          tags={["OpenCV", "Computer Vision", "ML"]}
          status="Concept"
          color="bg-emerald-50"
          icon={<Eye size={20} />}
        />
        
        {/* GitHub Link Card */}
        <a href="https://github.com/godfreyponce" target="_blank" rel="noopener noreferrer" className="group h-full min-h-[200px] p-8 rounded-3xl bg-zinc-900 dark:bg-zinc-950 text-white flex flex-col justify-center items-center text-center gap-4 hover:bg-zinc-800 dark:hover:bg-zinc-900 transition-colors relative overflow-hidden">
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
