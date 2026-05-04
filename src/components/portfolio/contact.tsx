import { Github, Mail } from "lucide-react";
import { MagneticButton } from "./magnetic-button";
import { profile } from "@/data/profile";

export const Contact = () => {
  return (
    <section id="contact" className="container py-32 md:py-40">
      <div className="card-surface relative overflow-hidden p-10 md:p-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-warm opacity-20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-warm opacity-10 blur-3xl" />

        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="mono-label">// let's talk</p>
            <h2 className="mt-3 font-display text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl reveal" data-reveal>
              Let's build{" "}
              <em className="italic text-gradient-warm">something good.</em>
            </h2>
            <p className="mt-6 max-w-lg text-foreground/80 md:text-lg reveal" data-reveal data-reveal-delay="100">
              Open to collaborations, freelance work, and odd little ideas. Drop a line — I usually reply faster than my git push.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3 reveal" data-reveal data-reveal-delay="200">
              <MagneticButton href={`mailto:${profile.email}`} icon={<Mail className="h-3.5 w-3.5" />}>
                {profile.email}
              </MagneticButton>
              <MagneticButton href={profile.github} external variant="ghost" icon={<Github className="h-3.5 w-3.5" />}>
                @{profile.handle}
              </MagneticButton>
            </div>
          </div>

          <aside className="space-y-3 reveal" data-reveal data-reveal-delay="200">
            <Row label="status" value="available · 2026" dot />
            <Row label="based" value="Arch Linux" />
            <Row label="working hours" value="08 — late" />
            <Row label="response time" value="≤ 24h" />
            <Row label="best contact" value="email · GitHub" />
          </aside>
        </div>
      </div>
    </section>
  );
};

const Row = ({ label, value, dot }: { label: string; value: string; dot?: boolean }) => (
  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 px-4 py-3">
    <span className="mono-label">{label}</span>
    <span className="flex items-center gap-2 font-display text-base italic text-foreground">
      {dot && <span className="pill-dot" />}
      {value}
    </span>
  </div>
);
