import type { ReactNode } from "react";

interface SocialLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export default function SocialLink({ href, children, className = "", ariaLabel }: SocialLinkProps) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`transition-colors hover:text-ink ${className}`}
    >
      {children}
    </a>
  );
}
