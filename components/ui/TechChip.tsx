import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { techIcons } from "@/lib/projects";

// A tag with a brand mark shows the mark alone and names itself on hover or focus (#69).
// Tags with no official mark have nothing to show, so they keep the text badge.
export default function TechChip({ tag }: { tag: string }) {
  const icon = techIcons[tag];

  if (!icon) return <Badge>{tag}</Badge>;

  return (
    <span tabIndex={0} className="group/chip relative inline-flex outline-offset-4">
      <Image
        src={icon}
        alt={tag}
        width={20}
        height={20}
        unoptimized
        className="opacity-75 group-hover/chip:opacity-100 group-focus-visible/chip:opacity-100 motion-safe:transition motion-safe:group-hover/chip:-translate-y-0.5 motion-safe:group-focus-visible/chip:-translate-y-0.5"
      />
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-rule bg-surface px-1.5 py-0.5 text-xs font-medium text-ink opacity-0 group-hover/chip:opacity-100 group-focus-visible/chip:opacity-100 motion-safe:transition-opacity">
        {tag}
      </span>
    </span>
  );
}
