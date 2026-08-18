import { Github, Linkedin, Mail } from "lucide-react";
import SocialLink from "@/components/ui/SocialLink";

export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-0 w-full bg-surface-inverse py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <h2 className="font-display text-2xl font-medium">Godfrey Ponce</h2>

        <div className="flex gap-6 text-white/60">
          <SocialLink href="https://github.com/godfreyponce" ariaLabel="GitHub" className="tactile-link hover:!text-white">
            <Github size={24} />
          </SocialLink>
          <SocialLink href="https://linkedin.com/in/godfreyponce" ariaLabel="LinkedIn" className="tactile-link hover:!text-white">
            <Linkedin size={24} />
          </SocialLink>
          <SocialLink href="mailto:poncegodfrey@gmail.com" ariaLabel="Email" className="tactile-link hover:!text-white">
            <Mail size={24} />
          </SocialLink>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-white/10 px-6 pt-8 text-sm text-white/50 md:flex-row">
        {/* left slot reserved for the latest-commit status line (#40) */}
        <span />
        <span>© Godfrey Ponce</span>
      </div>
    </footer>
  );
}
