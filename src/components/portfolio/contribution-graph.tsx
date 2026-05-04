import { useRef, useState } from "react";
import { type DayData } from "@/hooks/use-github-stats";

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  date: string;
  count: number;
}

interface ContributionGraphProps {
  weeks: DayData[][];
  contributions: number;
  loading?: boolean;
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export const ContributionGraph = ({ weeks, contributions, loading = false }: ContributionGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, date: "", count: 0 });

  // Compute month label positions
  const monthPositions: { label: string; col: number }[] = [];
  weeks.forEach((week, wi) => {
    const first = week[0];
    if (!first) return;
    const d = new Date(first.date + "T12:00:00Z");
    if (d.getUTCDate() <= 7) {
      const label = MONTH_LABELS[d.getUTCMonth()];
      // Avoid duplicate adjacent labels
      if (!monthPositions.length || monthPositions[monthPositions.length - 1].label !== label) {
        monthPositions.push({ label, col: wi });
      }
    }
  });

  const CELL = 11;
  const GAP = 2;
  const STEP = CELL + GAP;

  const handleMouseEnter = (e: React.MouseEvent<SVGRectElement>, day: DayData) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const target = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: target.left - rect.left + CELL / 2,
      y: target.top - rect.top,
      date: day.date,
      count: day.count,
    });
  };

  const handleMouseLeave = () => setTooltip((t) => ({ ...t, visible: false }));

  const svgWidth = weeks.length * STEP;
  const svgHeight = 7 * STEP - GAP;

  return (
    <section id="contributions" className="container py-20 md:py-28">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="mono-label">// activity.log</p>
          <h2
            className="mt-3 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl reveal"
            data-reveal
          >
            Contribution{" "}
            <em className="italic text-gradient-warm">history.</em>
          </h2>
        </div>
        <span className="hidden font-mono text-xs text-muted-foreground md:block">
          05 · activity
        </span>
      </div>

      <div
        ref={containerRef}
        className="card-surface relative overflow-hidden p-5 md:p-7 reveal"
        data-reveal
        data-reveal-delay="100"
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            {loading ? (
              <span className="inline-block animate-pulse">Loading activity…</span>
            ) : (
              <>
                <span className="font-display text-lg italic text-foreground">{contributions.toLocaleString()}</span>
                <span className="ml-2">contributions in the last year</span>
              </>
            )}
          </p>
          <a
            href="https://github.com/NVitschDEV"
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
          >
            view on github →
          </a>
        </div>

        {/* Graph */}
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Month labels */}
            <div className="relative mb-1" style={{ marginLeft: 28, height: 14 }}>
              {monthPositions.map(({ label, col }) => (
                <span
                  key={`${label}-${col}`}
                  className="absolute font-mono text-[10px] text-muted-foreground"
                  style={{ left: col * STEP }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Grid + day labels */}
            <div className="flex items-start gap-1">
              {/* Day-of-week labels */}
              <div className="flex flex-col gap-[2px] pt-px mr-1">
                {DAY_LABELS.map((d, i) => (
                  <div
                    key={d}
                    className="flex items-center justify-end font-mono text-[9px] text-muted-foreground/60"
                    style={{ height: CELL, visibility: i % 2 === 1 ? "visible" : "hidden" }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* SVG cells */}
              <svg
                width={svgWidth}
                height={svgHeight}
                style={{ display: "block", shapeRendering: "crispEdges" }}
              >
                {loading
                  ? // Skeleton placeholder
                    Array.from({ length: 53 }).map((_, wi) =>
                      Array.from({ length: 7 }).map((__, di) => (
                        <rect
                          key={`sk-${wi}-${di}`}
                          x={wi * STEP}
                          y={di * STEP}
                          width={CELL}
                          height={CELL}
                          rx={2}
                          className="fill-border/40 animate-pulse"
                        />
                      ))
                    )
                  : weeks.map((week, wi) =>
                      week.map((day) => {
                        const d = new Date(day.date + "T12:00:00Z");
                        const di = d.getUTCDay();
                        const level = getLevel(day.count);
                        return (
                          <rect
                            key={day.date}
                            x={wi * STEP}
                            y={di * STEP}
                            width={CELL}
                            height={CELL}
                            rx={2}
                            className={`transition-opacity hover:opacity-80 cursor-pointer ${
                              level === 0
                                ? "fill-border/50"
                                : level === 1
                                ? "fill-[hsl(22,90%,72%)]"
                                : level === 2
                                ? "fill-[hsl(22,90%,60%)]"
                                : level === 3
                                ? "fill-[hsl(22,90%,50%)]"
                                : "fill-[hsl(22,90%,38%)]"
                            }`}
                            onMouseEnter={(e) => handleMouseEnter(e, day)}
                            onMouseLeave={handleMouseLeave}
                          />
                        );
                      })
                    )}
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center justify-end gap-1.5">
              <span className="font-mono text-[10px] text-muted-foreground mr-1">Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-[11px] w-[11px] rounded-[2px] ${
                    level === 0
                      ? "bg-border/50"
                      : level === 1
                      ? "bg-[hsl(22,90%,72%)]"
                      : level === 2
                      ? "bg-[hsl(22,90%,60%)]"
                      : level === 3
                      ? "bg-[hsl(22,90%,50%)]"
                      : "bg-[hsl(22,90%,38%)]"
                  }`}
                />
              ))}
              <span className="font-mono text-[10px] text-muted-foreground ml-1">More</span>
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full -mt-2 whitespace-nowrap rounded-lg border border-border bg-card/95 px-2.5 py-1.5 shadow-lg backdrop-blur-sm"
            style={{ left: tooltip.x, top: tooltip.y - 6 }}
          >
            <p className="font-display text-sm italic text-foreground">
              {tooltip.count} contribution{tooltip.count !== 1 ? "s" : ""}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">{formatDate(tooltip.date)}</p>
          </div>
        )}
      </div>
    </section>
  );
};
