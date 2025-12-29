import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-900 text-white py-12 mt-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div>
          <h2 className="text-2xl font-bold">Godfrey Ponce</h2>
        </div>

        <div className="flex gap-6">
          <a href="https://github.com/godfreyponce" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">
            <Github size={24} />
          </a>
          <a href="https://linkedin.com/in/godfreyponce" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">
            <Linkedin size={24} />
          </a>
          <a href="mailto:poncegodfrey@gmail.com" className="hover:text-zinc-300 transition-colors">
            <Mail size={24} />
          </a>
        </div>

      </div>
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-800 text-center md:text-left text-zinc-500 text-sm">
        © {new Date().getFullYear()} Godfrey Ponce. All rights reserved.
      </div>
    </footer>
  );
}
