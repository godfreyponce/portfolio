import LatestCommitLine from "@/components/ui/LatestCommitLine";
import SocialLink from "@/components/ui/SocialLink";

const LINKS = [
  { label: "GitHub", href: "https://github.com/godfreyponce", handle: "github.com/godfreyponce" },
  { label: "LinkedIn", href: "https://linkedin.com/in/godfreyponce", handle: "linkedin.com/in/godfreyponce" },
  { label: "Email", href: "mailto:poncegodfrey@gmail.com", handle: "poncegodfrey@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-0 w-full bg-surface-inverse py-12 text-body">
      <div className="mx-auto max-w-page px-6">
        <p className="font-display text-2xl leading-[1.3] tracking-[-0.4px]">
          <a href="#top" className="text-surface">Godfrey Ponce</a>
        </p>

        <ul className="mt-8 grid grid-cols-3 gap-x-6 gap-y-5 max-md:grid-cols-1">
          {LINKS.map(({ label, href, handle }) => (
            <li key={label}>
              <SocialLink
                href={href}
                className="border-b border-dashed border-surface/40 font-semibold text-surface duration-200 hover:border-surface hover:!text-surface motion-reduce:transition-none"
              >
                {label}
              </SocialLink>
              <span className="mt-1 block font-mono text-[13px] leading-[1.5] text-ink-faint wrap-anywhere">{handle}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-6 font-mono text-[12.5px] leading-[1.7] text-ink-subtle max-md:flex-col">
          <LatestCommitLine />
          <span>© Godfrey Ponce</span>
        </div>
      </div>
    </footer>
  );
}
