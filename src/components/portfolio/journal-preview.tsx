import { ArrowRight } from "lucide-react";
import { journalEntries } from "@/data/journal";
import { profile } from "@/data/profile";

export const JournalPreview = () => {
  return (
    <section id="journal" className="container py-32 md:py-40">
      <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mono-label">// notes from the workbench</p>
          <h2 className="mt-3 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl reveal" data-reveal>
            A working <em className="italic text-gradient-warm">journal.</em>
          </h2>
        </div>
        <a
          href={profile.journal}
          target="_blank"
          rel="noreferrer noopener"
          data-cursor="hover"
          className="group inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-[hsl(var(--accent))] hover:text-foreground md:self-end"
        >
          read all entries
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {journalEntries.map((e, i) => (
          <li key={e.index} className="reveal" data-reveal data-reveal-delay={i * 100}>
            <a
              href={e.href}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="hover"
              className="card-surface hover-lift block p-7"
            >
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span>{e.index}</span>
                <span>{e.date}</span>
              </div>
              <h3 className="mt-6 font-display text-3xl font-medium leading-tight md:text-4xl">{e.title}</h3>
              <p className="mt-4 text-foreground/75">{e.excerpt}</p>
              <div className="mt-6 flex items-center justify-between">
                <ul className="flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <li key={t} className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {t}
                    </li>
                  ))}
                </ul>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--accent))]">
                  {e.readTime} →
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
