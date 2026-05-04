import { useEffect, useRef, useState } from "react";

/**
 * Tiny canvas Snake — embedded easter egg launched from the command palette.
 * Arrow keys / WASD to steer, Space to start/restart.
 */
export const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const stored = Number(localStorage.getItem("nv-snake-best") || 0);
    setBest(stored);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLS = 22, ROWS = 16, CELL = canvas.width / COLS;

    let snake = [{ x: 10, y: 8 }, { x: 9, y: 8 }, { x: 8, y: 8 }];
    let dir = { x: 1, y: 0 };
    let queued = { x: 1, y: 0 };
    let food = spawnFood();
    let alive = true;
    let raf = 0;
    let last = 0;
    const SPEED = 110;

    function spawnFood() {
      while (true) {
        const f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
        if (!snake.some((s) => s.x === f.x && s.y === f.y)) return f;
      }
    }

    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim();
    const muted = getComputedStyle(document.documentElement).getPropertyValue("--muted").trim();

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      // grid
      ctx.fillStyle = `hsl(${muted} / 0.25)`;
      for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) {
        if ((x + y) % 2 === 0) ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
      // food
      ctx.fillStyle = `hsl(${accent})`;
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL * 0.32, 0, Math.PI * 2);
      ctx.fill();
      // snake
      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? `hsl(${fg})` : `hsl(${fg} / ${0.85 - i * 0.02})`;
        const r = 4;
        roundRect(ctx, s.x * CELL + 2, s.y * CELL + 2, CELL - 4, CELL - 4, r);
        ctx.fill();
      });
    }

    function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }

    function step() {
      dir = queued;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || snake.some((s) => s.x === head.x && s.y === head.y)) {
        alive = false;
        setRunning(false);
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => {
          const ns = s + 1;
          setBest((b) => {
            const nb = Math.max(b, ns);
            try { localStorage.setItem("nv-snake-best", String(nb)); } catch {}
            return nb;
          });
          return ns;
        });
        food = spawnFood();
      } else {
        snake.pop();
      }
    }

    function loop(t: number) {
      if (!alive) { draw(); return; }
      if (t - last > SPEED) { step(); last = t; }
      draw();
      raf = requestAnimationFrame(loop);
    }

    function onKey(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      const cur = dir;
      if ((k === "arrowup" || k === "w") && cur.y !== 1) queued = { x: 0, y: -1 };
      else if ((k === "arrowdown" || k === "s") && cur.y !== -1) queued = { x: 0, y: 1 };
      else if ((k === "arrowleft" || k === "a") && cur.x !== 1) queued = { x: -1, y: 0 };
      else if ((k === "arrowright" || k === "d") && cur.x !== -1) queued = { x: 1, y: 0 };
      else if (k === " ") {
        e.preventDefault();
        if (!alive) {
          snake = [{ x: 10, y: 8 }, { x: 9, y: 8 }, { x: 8, y: 8 }];
          dir = { x: 1, y: 0 };
          queued = { x: 1, y: 0 };
          food = spawnFood();
          alive = true;
          setScore(0);
          setRunning(true);
          last = 0;
          raf = requestAnimationFrame(loop);
        } else if (!running) {
          setRunning(true);
          raf = requestAnimationFrame(loop);
        }
      }
    }

    draw();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>Score · <span className="text-foreground">{score}</span></span>
        <span>Best · <span className="text-foreground">{best}</span></span>
      </div>
      <div className="relative rounded-2xl border border-border bg-card/60 p-3">
        <canvas ref={canvasRef} width={528} height={384} className="block max-w-full rounded-lg" />
        {!running && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="font-display text-2xl italic text-foreground/85">press space to begin</p>
          </div>
        )}
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        space · start · arrows / wasd · steer
      </p>
    </div>
  );
};
