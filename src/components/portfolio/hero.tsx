import { useState, useEffect } from "react";
import { Github, Mail } from "lucide-react";
import { MagneticButton } from "./magnetic-button";
import { profile } from "@/data/profile";

const wordmarkWords = ["NVitsch", "DEV"];

interface HeroProps {
  contributions?: number;
  repositories?: number;
  loading?: boolean;
}

function useCountUp(end: number, duration: number = 2000, startAnimating: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimating) return;
    let startTime: number;
    let animationFrame: number;

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startAnimating]);

  return count;
}

function useTypewriter(words: string[], typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const current = loopNum % words.length;
    const fullText = words[current];

    if (isDeleting) {
      timer = setTimeout(() => {
        setText(fullText.substring(0, text.length - 1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setText(fullText.substring(0, text.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && text === fullText) {
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
}

export const Hero = ({ contributions, repositories, loading = false }: HeroProps) => {
  const displayContributions = useCountUp(contributions ?? 0, 2000, !loading && contributions !== undefined);
  const displayRepositories = useCountUp(repositories ?? 0, 2000, !loading && repositories !== undefined);
  const typedRole = useTypewriter(profile.roles ?? [profile.role], 60, 30, 1500);

  return (
    <section id="top" className="relative overflow-hidden pt-32 md:pt-40">
      <div className="container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* LEFT */}
          <div>
            <div className="mb-8 flex items-center gap-3 animate-fade-in">
              <span className="pill">
                <span className="pill-dot" />
                Available for collaboration
              </span>
              <span className="font-mono text-xs text-muted-foreground">// {profile.name}</span>
            </div>

            <h1 className="font-display text-[clamp(3.25rem,11vw,9rem)] font-medium leading-[0.92] tracking-tight">
              {wordmarkWords.map((w, i) => (
                <span
                  key={w}
                  className="inline-block animate-fade-up"
                  style={{ animationDelay: `${120 + i * 140}ms` }}
                >
                  {i === 0 ? <span className="text-foreground">{w}</span> : <em className="not-italic text-shimmer font-display italic">{w}</em>}
                </span>
              ))}
            </h1>

            <div className="mt-5 grid font-mono text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "420ms" }}>
              <span className="col-start-1 row-start-1 invisible select-none" aria-hidden="true">
                {profile.roles?.reduce((a, b) => (a.length > b.length ? a : b), "") || profile.role}
              </span>
              <div className="col-start-1 row-start-1 flex items-center gap-3">
                <span>{typedRole}</span>
                <span className="inline-block h-3 w-2 bg-[hsl(var(--accent))] blink" />
              </div>
            </div>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/80 md:text-lg animate-fade-up" style={{ animationDelay: "560ms" }}>
              {profile.bio}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: "700ms" }}>
              <MagneticButton href={profile.github} external icon={<Github className="h-3.5 w-3.5" />}>
                GitHub Profile
              </MagneticButton>
              <MagneticButton href="#contact" variant="ghost" icon={<Mail className="h-3.5 w-3.5" />}>
                Get in Touch
              </MagneticButton>
            </div>
          </div>

          {/* RIGHT — identity badge + floating stat cards */}
          <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
            <div className="relative aspect-square w-[78%] animate-fade-in" style={{ animationDelay: "300ms" }}>
              {/* Glow */}
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-warm opacity-25 blur-3xl" />
              {/* Frame */}
              <div className="relative h-full w-full overflow-hidden rounded-full border border-border bg-card/40 p-1 shadow-[var(--shadow-elegant)]">
                <div className="h-full w-full overflow-hidden rounded-full bg-gradient-warm-soft">
                  <img
                    src={profile.avatar}
                    alt={`${profile.name} — avatar`}
                    loading="eager"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Floating cards — repositories + contributions, like the old site */}
              <div className="absolute -right-4 top-6 card-surface px-4 py-3 animate-fade-up" style={{ animationDelay: "640ms" }}>
                <div className={`font-display text-2xl italic transition-opacity ${loading ? "opacity-40 animate-pulse" : ""}`}>
                  {loading ? "—" : displayRepositories}
                </div>
                <div className="mono-label mt-1">repositories</div>
              </div>
              <div className="absolute -left-6 bottom-8 card-surface px-4 py-3 animate-fade-up" style={{ animationDelay: "780ms" }}>
                <div className={`font-display text-2xl italic transition-opacity ${loading ? "opacity-40 animate-pulse" : ""}`}>
                  {loading ? "—" : displayContributions}
                </div>
                <div className="mono-label mt-1">contributions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="mt-24 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-px w-10 bg-border" />
          scroll · explore the work
        </div>
      </div>
    </section>
  );
};
