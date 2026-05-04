import { ThemeToggle } from "./theme-toggle";

const links = [
  { id: "about", label: "about" },
  { id: "work", label: "work" },
  { id: "stack", label: "stack" },
  { id: "reel", label: "reel" },
  { id: "journal", label: "journal" },
  { id: "contact", label: "contact" },
];

export const TopBar = () => {
  const onJump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" onClick={onJump("top")} className="flex items-baseline gap-2">
          <span className="font-display text-xl tracking-tight">NVitsch<em className="text-gradient-warm">DEV</em></span>
          <span className="font-display text-sm italic text-muted-foreground">/ Portfolio</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={onJump(l.id)}
              className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">press · /</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
