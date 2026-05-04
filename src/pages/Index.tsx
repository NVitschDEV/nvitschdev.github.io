import { useReveal } from "@/hooks/use-reveal";
import { useGitHubStats } from "@/hooks/use-github-stats";
import { ThemeProvider } from "@/components/portfolio/theme-provider";
import { CustomCursor } from "@/components/portfolio/custom-cursor";
import { CommandPalette } from "@/components/portfolio/command-palette";
import { TopBar } from "@/components/portfolio/top-bar";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { FeaturedWork } from "@/components/portfolio/featured-work";
import { StackMarquee } from "@/components/portfolio/stack-marquee";
import { Reel } from "@/components/portfolio/reel";
import { JournalPreview } from "@/components/portfolio/journal-preview";
import { ContributionGraph } from "@/components/portfolio/contribution-graph";
import { Contact } from "@/components/portfolio/contact";
import { Footer } from "@/components/portfolio/footer";
import { profile } from "@/data/profile";

const Portfolio = () => {
  useReveal();
  const ghStats = useGitHubStats(profile.handle);

  return (
    <div className="relative min-h-screen">
      <CustomCursor />
      <CommandPalette />
      <TopBar />
      <main>
        <Hero
          contributions={ghStats.contributions}
          repositories={ghStats.repositories}
          loading={ghStats.loading}
        />
        <About />
        <FeaturedWork />
        <StackMarquee />
        <Reel />
        <JournalPreview />
        <ContributionGraph
          weeks={ghStats.weeks}
          contributions={ghStats.contributions}
          loading={ghStats.loading}
        />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

const Index = () => (
  <ThemeProvider>
    <Portfolio />
  </ThemeProvider>
);

export default Index;
