import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="group inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur transition-colors hover:border-[hsl(var(--accent))] hover:text-foreground"
    >
      {theme === "dark" ? <Sun className="h-3.5 w-3.5 text-[hsl(var(--accent))]" /> : <Moon className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />}
      <span>{theme === "dark" ? "light" : "dark"}</span>
    </button>
  );
};
