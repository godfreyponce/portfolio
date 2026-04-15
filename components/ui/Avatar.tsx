import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
  variant?: "cover" | "contain";
  className?: string;
}

export default function Avatar({ src, alt, variant = "cover", className = "" }: AvatarProps) {
  return (
    <div
      className={`relative w-12 h-12 shrink-0 overflow-hidden rounded-full bg-surface-raised border border-rule ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="48px"
        className={variant === "contain" ? "object-contain p-2" : "object-cover"}
      />
    </div>
  );
}
