import { Github, Linkedin, Mail } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <div className="flex items-center gap-6 px-6 py-3 bg-white/80 backdrop-blur-md border border-zinc-200 rounded-full shadow-sm pointer-events-auto transition-all hover:shadow-md hover:border-zinc-300">
        <a href="https://github.com/godfreyponce" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900 transition-colors">
          <Github size={18} />
        </a>
        <div className="w-px h-4 bg-zinc-200" />
        <a href="https://linkedin.com/in/godfreyponce" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900 transition-colors">
          <Linkedin size={18} />
        </a>
        <div className="w-px h-4 bg-zinc-200" />
        <a href="mailto:poncegodfrey@gmail.com" className="text-zinc-500 hover:text-zinc-900 transition-colors">
          <Mail size={18} />
        </a>
      </div>
    </nav>
  );
}
