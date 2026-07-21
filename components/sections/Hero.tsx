import Image from "next/image";
import SocialLink from "@/components/ui/SocialLink";

export default function Hero() {
  return (
    <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-12 px-6 pt-24 pb-8 md:flex-row md:pt-32 md:pb-12">
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

      <div className="flex flex-col items-center space-y-6 text-center md:items-start md:text-left">
        <h1 className="font-display text-5xl font-medium tracking-tight text-ink md:text-7xl">
          Godfrey Ponce
        </h1>

        <p className="max-w-4xl text-lg font-light leading-relaxed text-ink-muted md:text-2xl">
          I like to build agents that think, so we humans can create
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold uppercase tracking-[0.2em] text-ink-subtle md:text-base">
          <SocialLink
            href="https://github.com/godfreyponce"
            className="cursor-github hover:!text-brand-github"
          >
            Github
          </SocialLink>
          <span className="font-light text-ink-faint/40">/</span>
          <SocialLink
            href="https://linkedin.com/in/godfreyponce"
            className="cursor-linkedin hover:!text-brand-linkedin"
          >
            Linkedin
          </SocialLink>
          <span className="font-light text-ink-faint/40">/</span>
          <SocialLink
            href="mailto:poncegodfrey@gmail.com"
            className="email-google cursor-gmail"
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
    </section>
  );
}
