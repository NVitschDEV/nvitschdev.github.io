import { languages, profile } from "@/data/profile";

export const About = () => {
  return (
    <section id="about" className="container py-32 md:py-40">
      <div className="mb-12 flex items-end justify-between gap-6">
        <div>
          <p className="mono-label">// about.md</p>
          <h2 className="mt-3 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl reveal" data-reveal>
            Creative coder &{" "}
            <em className="italic text-gradient-warm">digital artisan.</em>
          </h2>
        </div>
        <span className="hidden font-mono text-xs text-muted-foreground md:block">02 · about</span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6 text-base leading-relaxed text-foreground/85 md:text-lg reveal" data-reveal data-reveal-delay="100">
          <p>
            Hey! I'm <strong className="text-foreground">{profile.handle}</strong> — a developer who blends technical
            craftsmanship with creative expression. My toolkit spans terminal utilities in Python, game
            development in Godot, 3D modeling, and cinematic video editing in DaVinci Resolve.
          </p>
          <p>
            I'm a proud <span className="text-foreground">Arch Linux</span> user (yes, I use Arch btw) and enjoy
            building tools that actually solve problems — like <em className="text-gradient-warm">ptodo</em>, a
            terminal todo-app that made it into the AUR.
          </p>
          <p>
            When I'm not pushing commits, I'm sculpting 3D scenes, cutting footage, reading, or exploring whatever
            rabbit hole the internet throws at me that week. I believe the best software is the one where the
            developer{" "}
            <a
              href={profile.journal}
              target="_blank"
              rel="noreferrer noopener"
              className="text-foreground underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-4"
            >
              had fun working on.
            </a>
          </p>
        </div>

        <aside className="card-surface p-6 reveal" data-reveal data-reveal-delay="200">
          <p className="mono-label mb-4">// spoken languages</p>
          <ul className="grid grid-cols-2 gap-2">
            {languages.map((l) => (
              <li
                key={l.name}
                className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
              >
                <span aria-hidden className="text-base">{l.flag}</span>
                <span className="text-foreground/85">{l.name}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Fact label="OS of choice" value="Arch Linux" />
            <Fact label="Editor" value="Neovim" />
            <Fact label="Brew" value="Tea, always" />
            <Fact label="Achievement" value="Pull Shark" />
          </div>
        </aside>
      </div>
    </section>
  );
};

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-border/60 bg-card/40 p-3">
    <div className="mono-label">{label}</div>
    <div className="mt-1 font-display text-base italic text-foreground">{value}</div>
  </div>
);
