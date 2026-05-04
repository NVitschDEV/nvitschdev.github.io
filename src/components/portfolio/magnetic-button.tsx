import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  external?: boolean;
  variant?: Variant;
  icon?: ReactNode;
}

/**
 * A pill button that gently tracks the cursor on hover.
 * Renders as <a> when href is provided.
 */
export const MagneticButton = ({
  href,
  external,
  variant = "primary",
  icon,
  className,
  children,
  ...rest
}: MagneticButtonProps) => {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
    };
    const onLeave = () => { el.style.transform = "translate(0,0)"; };
    el.addEventListener("pointermove", onMove as EventListener);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove as EventListener);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const base =
    "group relative inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[12px] uppercase tracking-[0.2em] transition-colors duration-300 will-change-transform";
  const styles =
    variant === "primary"
      ? "bg-foreground text-background hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
      : "border border-border text-foreground hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]";

  const inner = (
    <>
      {icon && <span className="opacity-90">{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        className={cn(base, styles, className)}
      >
        {inner}
      </a>
    );
  }

  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} className={cn(base, styles, className)} {...rest}>
      {inner}
    </button>
  );
};
