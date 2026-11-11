import Image from "next/image";
import type { Entry } from "@/lib/experience";

/* data-hot (strip hover/focus) and data-pop (strip click) are set on the <li> by LogoStrip */
export default function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ul className="mt-[51px] grid grid-cols-1 gap-x-6 gap-y-8 text-body text-ink-muted md:grid-cols-2">
      {entries.map((entry) => (
        <li
          key={entry.id}
          id={entry.id}
          className="group rounded-sm data-[pop]:animate-entry-pop motion-reduce:data-[pop]:animate-entry-pop-still"
        >
          <p className="flex items-start gap-2.5">
            <Image
              src={entry.logo}
              alt=""
              width={22}
              height={22}
              className="mt-[3px] size-[22px] flex-none rounded-sm object-cover"
            />
            <span>
              <a
                href={entry.orgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-dashed border-[rgba(127,127,127,0.5)] font-semibold text-ink-muted transition-colors duration-200 hover:border-ink hover:text-ink motion-reduce:transition-none"
              >
                {entry.org}
              </a>{" "}
              &ndash; {entry.role}
            </span>
          </p>
          <div className="pl-8">
            <p className="text-[13.5px] text-ink-subtle">{entry.description}</p>
            {entry.stack && (
              <ul aria-label="Stack" className="mb-0.5 mt-1.5 flex flex-wrap gap-2.5">
                {entry.stack.map((item) => (
                  <li key={item.label} title={item.label}>
                    <img
                      src={item.src}
                      alt=""
                      width={16}
                      height={16}
                      className="block size-4 object-contain opacity-45 grayscale transition-[filter,opacity] duration-250 group-hover:opacity-100 group-hover:grayscale-0 group-data-[hot]:opacity-100 group-data-[hot]:grayscale-0 group-data-[pop]:opacity-100 group-data-[pop]:grayscale-0 motion-reduce:transition-none"
                    />
                    <span className="sr-only">{item.label}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-ink-faint">
              {entry.start} -{" "}
              {entry.end === "Present" ? <b className="font-semibold text-accent-green">Present</b> : entry.end}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
