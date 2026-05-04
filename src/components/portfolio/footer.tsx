import { profile } from "@/data/profile";

export const Footer = () => {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="container flex flex-col items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:flex-row">
        <p>© 2026 · {profile.name} · {profile.handle}</p>
        <p className="flex items-center gap-3">
          <span>built with care</span>
          <span className="opacity-40">·</span>
          <span>arch btw</span>
          <span className="opacity-40">·</span>
          <span>powered by tea</span>
        </p>
        <p className="flex items-center gap-2">
          press <kbd className="rounded border border-border bg-secondary/60 px-1.5 py-0.5 text-foreground">/</kbd> for the terminal
        </p>
      </div>
    </footer>
  );
};
