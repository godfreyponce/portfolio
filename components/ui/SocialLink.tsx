import type { ReactNode } from "react";

interface SocialLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function SocialLink({ href, children, className = "" }: SocialLinkProps) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`transition-colors hover:text-ink ${className}`}
    >
      {children}
    </a>
  );
}
