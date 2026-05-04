import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { projects } from "@/data/projects";

const sizeMap: Record<NonNullable<Project["size"]>, string> = {
  lg: "md:col-span-7 md:row-span-2",
  md: "md:col-span-5",
  sm: "md:col-span-4",
};

const accentMap: Record<NonNullable<Project["accent"]>, string> = {
  warm: "from-[hsl(22_90%_55%/0.18)] to-transparent",
  cool: "from-[hsl(220_60%_55%/0.14)] to-transparent",
  mono: "from-[hsl(var(--foreground)/0.06)] to-transparent",
};

export const FeaturedWork = () => {
  return (
    <section id="work" className="container py-32 md:py-40">
      <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mono-label">// selected work</p>
          <h2 className="mt-3 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl reveal" data-reveal>
            Things I've built,{" "}
            <em className="italic text-gradient-warm">on purpose.</em>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground reveal" data-reveal data-reveal-delay="120">
          A short, opinionated list. Tools, games, words, and pixels — all hand-rolled with too much care.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:auto-rows-[minmax(220px,auto)]">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} delay={i * 70} />
        ))}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, delay }: { project: Project; delay: number }) => {
  const accent = accentMap[project.accent ?? "warm"];
  const size = sizeMap[project.size ?? "md"];
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor="hover"
      className={`group relative col-span-1 ${size} hover-lift card-surface overflow-hidden p-6 reveal`}
      data-reveal
      data-reveal-delay={delay}
    >
      {/* Accent wash */}
      <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${accent} opacity-70 transition-opacity duration-500 group-hover:opacity-100`} />
      {/* Index */}
      <div className="flex items-start justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">// {project.index}</span>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[hsl(var(--accent))]" />
      </div>

      {/* Content */}
      <div className="mt-10 md:mt-16">
        <h3 className="font-display text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">
          {project.title}
        </h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/75 md:text-base">
          {project.blurb}
        </p>
      </div>

      {/* Meta footer */}
      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>{project.year}</span>
        <span className="opacity-40">·</span>
        <span>{project.role}</span>
        <span className="opacity-40">·</span>
        <span className="flex flex-wrap items-center gap-2">
          {project.stack.map((s) => (
            <span key={s} className="rounded-full border border-border/60 bg-secondary/40 px-2 py-0.5 text-foreground/85">{s}</span>
          ))}
        </span>
      </div>
    </a>
  );
};
