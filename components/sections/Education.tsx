import Image from "next/image";

interface EducationItemProps {
  title: string;
  subtitle: string;
  date: string;
  description?: string;
  points?: string[];
  logoSrc: string;
}

function EducationItem({ title, subtitle, date, description, points, logoSrc }: EducationItemProps) {
  return (
    <div className="group relative flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-100 transition-colors">
      <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center overflow-hidden z-10 shrink-0 relative">
        <Image 
          src={logoSrc} 
          alt={`${subtitle} logo`} 
          fill 
          className={subtitle.includes("GDSC") ? "object-contain p-2" : "object-cover"}
        />
      </div>
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
          <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider whitespace-nowrap">{date}</span>
        </div>
        <p className="text-zinc-600 font-medium text-sm">{subtitle}</p>
        {description && <p className="text-zinc-500 text-sm mt-2 leading-relaxed">{description}</p>}
        {points && (
          <ul className="mt-3 space-y-2">
            {points.map((point, index) => (
              <li key={index} className="text-zinc-500 text-sm leading-relaxed flex gap-2">
                <span className="text-zinc-300">•</span>
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Education() {
  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-24 space-y-16">
      {/* Education Section */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
          Education
        </h2>
        <div className="space-y-2">
          <EducationItem 
            title="BS in Computer Science"
            subtitle="The University of Texas at Dallas"
            date="Fall 2024 - Winter 2027"
            description="Minor in Cognitive Science"
            points={[
              "Relevant Courses: Data Structures & Algorithms, Computer Architecture, Cognitive and Neural Modeling."
            ]}
            logoSrc="/utd_logo.jpeg"
          />
        </div>
      </div>

      {/* Leadership & Awards Section */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
          Leadership & Achievements
        </h2>
        <div className="space-y-6">
          <EducationItem 
            title="TechAssist - Data Center Assistant"
            subtitle="HackUTD 2025: Lost in the Pages"
            date="Oct 2025"
            points={[
              "Built a native iOS assistant in SwiftUI replacing paper manuals with a 'scan-to-solution' digital playbook.",
              "Engineered a QR scanner that dynamically navigates technicians using local model persistence."
            ]}
            logoSrc="/hackutd_logo.jpeg"
          />
          <EducationItem 
            title="Community Lead & Events Officer"
            subtitle="Google Developer Student Club (GDSC)"
            date="Fall 2024 - Present"
            points={[
              "Spearheaded a social media strategy boosting engagement by 850% and gaining 150k+ video views."
            ]}
            logoSrc="/gdsc_logo.png"
          />
        </div>
      </div>
    </section>
  );
}
