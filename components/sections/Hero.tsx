import Image from "next/image";
import ScrambleText from "@/components/ui/ScrambleText";
import SocialLink from "@/components/ui/SocialLink";
import Section from "@/components/ui/Section";

export default function Hero() {
  return (
    <Section className="relative z-10 flex flex-col items-center justify-center gap-12 md:flex-row">
      <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-full border-4 border-surface-raised shadow-lift md:h-64 md:w-64">
        <Image
          src="/godfrey_headShot.JPG"
          alt="Godfrey Ponce"
          fill
          sizes="(max-width: 768px) 192px, 256px"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col items-center space-y-2 text-center md:items-start md:text-left">
        <h1 className="font-hero text-h1 text-ink">
          Godfrey Ponce
        </h1>

        <p className="max-w-4xl text-lg font-light leading-relaxed text-ink-faint">
          <ScrambleText text="I like to build agents that think, so we humans can create" />
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold uppercase tracking-[0.2em] text-ink-subtle">
          <SocialLink
            href="https://github.com/godfreyponce"
            className="tactile-link cursor-github hover:!text-brand-github"
          >
            Github
          </SocialLink>
          <span className="font-light text-ink-faint/40">/</span>
          <SocialLink
            href="https://linkedin.com/in/godfreyponce"
            className="tactile-link cursor-linkedin hover:!text-brand-linkedin"
          >
            Linkedin
          </SocialLink>
          <span className="font-light text-ink-faint/40">/</span>
          <SocialLink
            href="mailto:poncegodfrey@gmail.com"
            className="email-google tactile-link cursor-gmail"
            ariaLabel="Email"
          >
            <span>E</span>
            <span>m</span>
            <span>a</span>
            <span>i</span>
            <span>l</span>
          </SocialLink>
        </div>
      </div>
    </Section>
  );
}
