import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { SnakeGame } from "./snake-game";
import { useTheme } from "./theme-provider";
import { ArrowRight, Folder, Github, Mail, NotebookPen, Palette, Terminal, User } from "lucide-react";

type Cmd = {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  run: () => void;
  icon: React.ReactNode;
};

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [snakeOpen, setSnakeOpen] = useState(false);
  const [archOpen, setArchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { toggle } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField = target && /^(INPUT|TEXTAREA)$/.test(target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !inField)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const commands: Cmd[] = [
    { id: "about",   label: "about",   hint: "jump to about",     keywords: "about bio me", run: () => scrollTo("about"),   icon: <User className="h-3.5 w-3.5" /> },
    { id: "work",    label: "work",    hint: "jump to projects",  keywords: "work projects portfolio", run: () => scrollTo("work"), icon: <Folder className="h-3.5 w-3.5" /> },
    { id: "journal", label: "journal", hint: "jump to journal",   keywords: "journal blog notes", run: () => scrollTo("journal"), icon: <NotebookPen className="h-3.5 w-3.5" /> },
    { id: "contact", label: "contact", hint: "jump to contact",   keywords: "contact email reach", run: () => scrollTo("contact"), icon: <Mail className="h-3.5 w-3.5" /> },
    { id: "github",  label: "github",  hint: "open GitHub profile", keywords: "github repo source", run: () => { setOpen(false); window.open("https://github.com/NVitschDEV", "_blank", "noopener"); }, icon: <Github className="h-3.5 w-3.5" /> },
    { id: "snake",   label: "snake",   hint: "play a quick game", keywords: "snake game play arcade", run: () => { setOpen(false); setSnakeOpen(true); }, icon: <Terminal className="h-3.5 w-3.5" /> },
    { id: "theme",   label: "theme",   hint: "toggle light / dark", keywords: "theme dark light mode", run: () => { setOpen(false); toggle(); }, icon: <Palette className="h-3.5 w-3.5" /> },
    { id: "arch",    label: "arch",    hint: "secret · btw",      keywords: "arch linux btw secret", run: () => { setOpen(false); setArchOpen(true); }, icon: <Terminal className="h-3.5 w-3.5" /> },
  ];

  const filtered = commands.filter((c) =>
    !query.trim() || (c.label + " " + c.keywords + " " + c.hint).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl overflow-hidden border-border bg-popover/95 p-0 backdrop-blur-xl">
          <DialogTitle className="sr-only">Command palette</DialogTitle>
          <div className="border-b border-border px-4 py-3 font-mono text-[12px] text-muted-foreground">
            <span className="text-[hsl(var(--accent))]">~/nvitschdev</span>
            <span className="mx-1">$</span>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="type a command…"
              className="w-[calc(100%-7rem)] bg-transparent text-foreground outline-none placeholder:text-muted-foreground/60"
              aria-label="command"
            />
            <span className="blink text-[hsl(var(--accent))]">_</span>
          </div>
          <ul className="max-h-80 overflow-auto p-2">
            {filtered.length === 0 && (
              <li className="px-3 py-6 text-center font-mono text-xs text-muted-foreground">
                no matches. try <span className="text-foreground">snake</span> or <span className="text-foreground">arch</span>.
              </li>
            )}
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  onClick={c.run}
                  className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-mono text-[13px] text-foreground transition-colors hover:bg-secondary"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[hsl(var(--accent))]">{c.icon}</span>
                    <span className="text-[hsl(var(--accent))]">&gt;</span>
                    <span>{c.label}</span>
                    <span className="text-muted-foreground">— {c.hint}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>↵ run · esc close</span>
            <span>⌘K · /</span>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={snakeOpen} onOpenChange={setSnakeOpen}>
        <DialogContent className="max-w-2xl border-border bg-popover/95 backdrop-blur-xl">
          <DialogTitle className="font-display text-2xl">Snake, refined.</DialogTitle>
          <SnakeGame />
        </DialogContent>
      </Dialog>

      <Dialog open={archOpen} onOpenChange={setArchOpen}>
        <DialogContent className="max-w-md border-border bg-popover/95 backdrop-blur-xl">
          <DialogTitle className="sr-only">btw</DialogTitle>
          <pre className="overflow-x-auto font-mono text-[10px] leading-tight text-[hsl(var(--accent))]">
{`             /\\
            /  \\
           /\\   \\
          /      \\
         /   ,,   \\
        /   |  |  -\\
       /_-''    ''-_\\

   i use arch btw.`}
          </pre>
        </DialogContent>
      </Dialog>
    </>
  );
};
