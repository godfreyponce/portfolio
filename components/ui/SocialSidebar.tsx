import { Github, Linkedin, Mail } from "lucide-react";

export default function SocialSidebar() {
  return (
    <div className="fixed left-8 bottom-0 z-[100] hidden lg:flex flex-col items-center gap-6 after:w-px after:h-24 after:bg-zinc-200">
      <a href="https://github.com/godfreyponce" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-all hover:-translate-y-1">
        <Github size={20} />
      </a>
      <a href="https://linkedin.com/in/godfreyponce" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-all hover:-translate-y-1">
        <Linkedin size={20} />
      </a>
      <a href="mailto:poncegodfrey@gmail.com" className="text-zinc-400 hover:text-zinc-900 transition-all hover:-translate-y-1">
        <Mail size={20} />
      </a>
    </div>
  );
}
