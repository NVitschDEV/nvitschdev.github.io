import { stack } from "@/data/profile";

export const StackMarquee = () => {
  // Duplicate items so the -50% loop is seamless.
  const items = [...stack, ...stack];

  return (
    <section id="stack" className="relative overflow-hidden border-y border-border/60 bg-secondary/30 py-20">
      <div className="container mb-10 flex items-end justify-between">
        <div>
          <p className="mono-label">// the toolbelt</p>
          <h2 className="mt-3 font-display text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl reveal" data-reveal>
            Built with <em className="italic text-gradient-warm">tools I trust.</em>
          </h2>
        </div>
        <span className="hidden font-mono text-xs text-muted-foreground md:block">04 · stack</span>
      </div>

      <div className="marquee-pause group relative">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />

        <ul className="marquee flex w-max items-center gap-12 whitespace-nowrap will-change-transform">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 font-display text-3xl italic text-foreground/70 md:text-5xl"
            >
              {item}
              <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
