import EntryList from "@/components/sections/EntryList";
import { WORK } from "@/lib/experience";

export default function Timeline() {
  return (
    <div className="mx-auto max-w-page px-6">
      <section aria-labelledby="work" className="border-t border-rule pb-16">
        <h2
          id="work"
          className="mt-[55px] font-display text-[1.3125rem] font-medium italic leading-[1.3] tracking-[-0.3px] text-ink"
        >
          Work Experience&nbsp;&raquo;
        </h2>
        <EntryList entries={WORK} />
      </section>
    </div>
  );
}
