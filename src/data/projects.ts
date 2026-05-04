export type Project = {
  id: string;
  index: string;
  title: string;
  year: string;
  role: string;
  stack: string[];
  blurb: string;
  href: string;
  repo?: string;
  accent?: "warm" | "cool" | "mono";
  size?: "lg" | "md" | "sm";
};

export const projects: Project[] = [
  {
    id: "ptodo",
    index: "01",
    title: "ptodo",
    year: "2025",
    role: "Author",
    stack: ["Python", "TUI", "AUR"],
    blurb:
      "A terminal todo-app that actually respects your terminal. Vim-style keys, plain-text storage, zero ceremony — and yes, it's in the AUR.",
    href: "https://github.com/NVitschDEV",
    repo: "NVitschDEV/ptodo",
    accent: "warm",
    size: "lg",
  },
  {
    id: "snake",
    index: "02",
    title: "Snake, refined.",
    year: "2026",
    role: "Design · Dev",
    stack: ["HTML", "Canvas", "JS"],
    blurb:
      "Eat. Grow. Don't bite yourself. The arcade classic ported from my TUI version to the browser, because friends on Windows wanted to play too.",
    href: "https://nvitschdev.github.io/snakegame_html/",
    accent: "cool",
    size: "md",
  },
  {
    id: "journal",
    index: "03",
    title: "Notes from the workbench",
    year: "2026",
    role: "Writer · Dev",
    stack: ["Static", "Editorial"],
    blurb:
      "A working journal — what I'm building, breaking, and reading. Less manifesto, more sketchbook.",
    href: "https://nvitschdev.github.io/journal",
    accent: "mono",
    size: "md",
  },
  {
    id: "godot",
    index: "04",
    title: "Godot experiments",
    year: "2025",
    role: "Solo dev",
    stack: ["Godot", "GDScript", "Pixel"],
    blurb:
      "Small games and prototypes built in Godot. Tight loops, hand-tuned feel, and the occasional pixel sprite I drew at 1am.",
    href: "https://github.com/NVitschDEV",
    accent: "warm",
    size: "md",
  },
  {
    id: "renders",
    index: "05",
    title: "3D renders",
    year: "2024 — now",
    role: "Modeler · Lighter",
    stack: ["Blender", "Cycles"],
    blurb:
      "Sculpts, scenes, and product mockups. Slow craft after a fast workday.",
    href: "https://github.com/NVitschDEV",
    accent: "cool",
    size: "sm",
  },
];
