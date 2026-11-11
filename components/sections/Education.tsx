import EntryList from "@/components/sections/EntryList";
import { EDUCATION } from "@/lib/experience";

export default function Education() {
  return (
    <div className="mx-auto max-w-page px-6">
      <section aria-labelledby="education" className="border-t border-rule pb-16">
        <h2
          id="education"
          className="mt-[55px] font-display text-[1.3125rem] font-medium italic leading-[1.3] tracking-[-0.3px] text-ink"
        >
          Education&nbsp;&raquo;
        </h2>
        <EntryList entries={EDUCATION} />
      </section>
    </div>
  );
}
