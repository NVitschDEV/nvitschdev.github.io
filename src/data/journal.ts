export type JournalEntry = {
  index: string;
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  href: string;
};

export const journalEntries: JournalEntry[] = [
  {
    index: "01",
    date: "April 26, 2026",
    title: "Hello, world! (Again…)",
    excerpt:
      "Starting a journal. Less manifesto, more sketchbook — what I'm building, breaking, and reading this week.",
    tags: ["hi", "writing"],
    readTime: "1 min read",
    href: "https://nvitschdev.github.io/journal",
  },
  {
    index: "02",
    date: "April 27, 2026",
    title: "How to use Arch Linux; guide number 1",
    excerpt:
      "Probably the first guide on using Arch Linux. I'm not a Linux expert, but I've been using it for years. A quick overview of the basics.",
    tags: ["linux", "arch", "guides"],
    readTime: "2 min read",
    href: "https://nvitschdev.github.io/journal",
  },
];
