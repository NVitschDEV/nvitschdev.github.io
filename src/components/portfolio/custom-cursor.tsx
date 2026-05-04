import { useEffect, useRef } from "react";

/**
 * Subtle dot + halo cursor. Halo lags the dot for a soft trailing feel.
 * Hidden on touch / coarse pointers.
 */
export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const halo = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    document.body.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest('a, button, [role="button"], input, textarea, [data-cursor="hover"]');
      if (interactive !== hovering.current) {
        hovering.current = interactive;
        haloRef.current?.classList.toggle("is-hover", interactive);
      }
    };

    let raf = 0;
    const tick = () => {
      halo.current.x += (target.current.x - halo.current.x) * 0.18;
      halo.current.y += (target.current.y - halo.current.y) * 0.18;
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${halo.current.x}px, ${halo.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={haloRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 rounded-full border border-[hsl(var(--accent)/0.5)] transition-[width,height,background-color] duration-300 ease-out [&.is-hover]:h-14 [&.is-hover]:w-14 [&.is-hover]:bg-[hsl(var(--accent)/0.08)] [&.is-hover]:border-[hsl(var(--accent))]"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      />
    </>
  );
};
