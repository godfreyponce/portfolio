import Image from "next/image";

const SERIF = "font-display text-[1.3125rem] leading-[1.3] tracking-[-0.3px] text-ink";
const EYEBROW = "text-h2 leading-[1.4] uppercase tracking-[0.4px] text-ink-faint";

export default function Passions() {
  return (
    <div className="mx-auto max-w-page px-6">
      <section id="soccer" aria-labelledby="passions-head" className="scroll-mt-24 border-t border-rule pb-16">
        <h2 id="passions-head" className={`mt-[55px] ${SERIF} italic font-medium`}>
          Passions&nbsp;&raquo;
        </h2>
        <div className="mt-[55px] grid grid-cols-1 items-start gap-x-12 gap-y-10 md:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
          <figure>
            <Image
              src="/godfrey_soccerShot.jpg"
              alt="Godfrey playing soccer"
              width={1400}
              height={933}
              sizes="(min-width: 768px) 578px, 100vw"
              className="block h-auto w-full"
            />
            <figcaption>
              <p className={`mt-5 ${EYEBROW}`}>Soccer</p>
              <p className={`mt-1 ${SERIF} font-normal`}>The Beautiful Game</p>
              <p className="mt-2 max-w-[536px] text-body text-ink-muted">
                A lifelong athlete, I believe the best results come from disciplined teamwork, bringing in the same energy and translating it over to professional environments.
              </p>
            </figcaption>
          </figure>
          <div className="flex flex-col">
            <div>
              <p className={EYEBROW}>Snowboarding</p>
              <p className={`mt-1 ${SERIF} font-normal`}>Carving Lines</p>
            </div>
            <div className="mt-7 border-t border-rule">
              <p className={`mt-5 ${EYEBROW}`}>Home Lab</p>
              <p className={`mt-1 ${SERIF} font-normal`}>Self-hosted by default</p>
              <p className="mt-2 text-body text-ink-muted">
                I self host my own infrastructure to avoid paying for subscriptions and to keep my data secure/private.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
