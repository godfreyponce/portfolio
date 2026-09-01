interface TechTagProps {
  label: string;
  src: string;
}

export default function TechTag({ label, src }: TechTagProps) {
  return (
    <span tabIndex={0} className="group relative inline-flex outline-offset-2">
      <img src={src} alt={label} className="block h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1.5 whitespace-nowrap rounded-sm bg-ink px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
