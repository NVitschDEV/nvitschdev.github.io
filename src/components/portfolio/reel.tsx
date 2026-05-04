import { ModelViewer } from "./model-viewer";

export const Reel = () => {
  return (
    <section id="reel" className="container py-32 md:py-40">
      <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mono-label">// 3D · interactive</p>
          <h2 className="mt-3 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl reveal" data-reveal>
            Made with <em className="italic text-gradient-warm">light and time.</em>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground reveal" data-reveal data-reveal-delay="120">
          A model from the workbench — drag to spin, scroll to zoom. Pulled straight from the slicer.
        </p>
      </div>

      <article
        className="group relative overflow-hidden card-surface hover-lift reveal"
        data-reveal
      >
        <div className="relative aspect-square w-full md:aspect-[16/10]">
          {/* warm wash + dot-grid for visual continuity */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[hsl(22_90%_55%/0.28)] via-[hsl(28_85%_70%/0.14)] to-transparent" />
          <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(hsl(var(--foreground)/0.07)_1px,transparent_1px)] [background-size:14px_14px]" />

          {/* hint chip */}
          <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-border/60 bg-background/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
            drag · scroll · spin
          </div>

          {/* the canvas */}
          <div className="absolute inset-0" data-cursor="hover">
            <ModelViewer url={`${import.meta.env.BASE_URL}models/lightning.glb`} />
          </div>

          {/* bottom caption */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-background/70 to-transparent p-5">
            <div>
              <h3 className="font-display text-2xl italic text-foreground md:text-3xl">LIGHTNING</h3>
              <p className="mono-label mt-1">// fictional phone idea · interactive · drag to rotate</p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};
