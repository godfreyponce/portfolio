import Image from "next/image";

interface TimelineItemProps {
  date: string;
  title: string;
  subtitle: string;
  logoSrc: string;
  points: string[];
  tags?: string[];
  isLast?: boolean;
}

function TimelineItem({ date, title, subtitle, logoSrc, points, tags, isLast }: TimelineItemProps) {
  return (
    <div className="flex gap-4 relative">
      {/* Icon & Line Column */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center overflow-hidden z-10 shrink-0 relative transition-colors duration-500">
          <Image
            src={logoSrc}
            alt={`${subtitle} logo`}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        {!isLast && <div className="w-[2px] bg-zinc-200 grow mt-2 mb-2 transition-colors duration-500" />}
      </div>

      {/* Content Column */}
      <div className="pb-12">
        <span className="text-sm font-medium text-zinc-400">{date}</span>
        <h3 className="text-xl font-bold text-zinc-900 mt-1">{title}</h3>
        <p className="text-zinc-600 font-medium mb-3">{subtitle}</p>
        
        <ul className="list-disc list-outside ml-4 space-y-2 text-zinc-500 leading-relaxed max-w-lg marker:text-zinc-300">
          {points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>

        {tags && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 bg-zinc-100 text-zinc-500 rounded-md font-medium border border-zinc-200 transition-colors duration-500">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Timeline() {
  return (
    <section className="w-full max-w-3xl mx-auto px-6 pt-24 pb-8">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-12">
        Work Experience
      </h2>
      
      <div className="flex flex-col">
        <TimelineItem 
          date="November 2025 - January 2026"
          title="AI Data Researcher - Contract"
          subtitle="Handshake AI"
          logoSrc="/team_handshake_logo.jpeg"
          points={[
            "Conducting RLHF to fine-tune multimodal AI models, focusing on alignment, safety, and reasoning logic.",
            "Providing structured feedback on edge cases to engineering teams to support the data centric AI lifecycle."
          ]}
        />

        <TimelineItem 
          date="October 2025 - December 2025"
          title="AI Agent Developer - Externship"
          subtitle="Wayfair"
          logoSrc="/wayfair_logo.jpeg"
          points={[
            "Developing AI agents with Google Gemini 2.5 to automate competitor trend analysis and data scraping.",
            "Building live dashboards to visualize real time market insights extracted from diverse data streams."
          ]}
          tags={["Python", "Google Gemini", "Tableau", "n8n" ,"JavaScript"]}
        />

        <TimelineItem 
          date="August 2025 - Present"
          title="Web Specialist"
          subtitle="Jonsson School of Engineering & Computer Science (UT Dallas)"
          logoSrc="/utdjonsson_logo.jpeg"
          points={[
            "Managed the technical lifecycle of 20+ departmental and lab websites, implementing high performance responsive frameworks that enhanced the university's digital accessibility.",
            "Coordinated high priority site migrations and asset management using Jira, ensuring seamless delivery of large scale university updates."
          ]}
          tags={["WordPress", "HTML/CSS/JS", "Jira", "DreamWeaver"]}
        />
        
        <TimelineItem 
          date="May 2025 - August 2025"
          title="Technical Advisor"
          subtitle="Apple"
          logoSrc="/apple_logo.jpeg"
          points={[
            "Resolved complex iOS/macOS technical issues with a 96% success rate using advanced diagnostics.",
            "Provided user-focused support while relaying critical technical feedback to internal engineering teams."
          ]}
          tags={["Tableau", "iOS/macOS", "Keynote"]}
        />

        <TimelineItem 
          date="Fall 2024 - Present"
          title="Community & Events Officer"
          subtitle="Google Developer Student Club (GDSC)"
          logoSrc="/gdsc_logo.png"
          points={[
            "Spearheaded a social media strategy boosting engagement by 850% and gaining 150k+ video views."
          ]}
          isLast
        />
      </div>
    </section>
  );
}
