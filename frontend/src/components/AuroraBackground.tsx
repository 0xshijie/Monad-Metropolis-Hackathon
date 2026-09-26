import { useEffect, useRef } from "react";

type RGB = { r: number; g: number; b: number };

const PALETTE: RGB[] = [
  { r: 139, g: 92, b: 246 }, // violet
  { r: 167, g: 139, b: 250 }, // lilac
  { r: 251, g: 191, b: 36 }, // gold
  { r: 217, g: 70, b: 239 }, // fuchsia
];

interface Blob {
  x: number;
  y: number;
  r: number;
  color: RGB;
  dx: number;
  dy: number;
  phase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: RGB;
  alpha: number;
  tw: number;
}

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;

    const blobs: Blob[] = [];
    const particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    function seed() {
      blobs.length = 0;
      particles.length = 0;

      const blobCount = Math.max(3, Math.min(6, Math.floor(width / 360)));
      for (let i = 0; i < blobCount; i++) {
        blobs.push({
          x: rand(0, width),
          y: rand(0, height),
          r: rand(0.55, 1) * Math.max(width, height) * 0.3,
          color: PALETTE[i % PALETTE.length],
          dx: rand(-0.16, 0.16),
          dy: rand(-0.12, 0.12),
          phase: rand(0, Math.PI * 2),
        });
      }

      const particleCount = Math.min(110, Math.floor((width * height) / 16000));
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: rand(0, width),
          y: rand(0, height),
          vx: rand(-0.2, 0.2),
          vy: rand(-0.34, -0.06),
          r: rand(0.6, 1.9),
          color: PALETTE[Math.floor(rand(0, PALETTE.length))],
          alpha: rand(0.2, 0.85),
          tw: rand(0, Math.PI * 2),
        });
      }
    }

    function render(t: number) {
      ctx!.clearRect(0, 0, width, height);
      ctx!.globalCompositeOperation = "lighter";

      for (const b of blobs) {
        b.x += b.dx;
        b.y += b.dy;
        const x = b.x + Math.sin(t * 0.00022 + b.phase) * 0.8;
        const y = b.y + Math.cos(t * 0.00018 + b.phase) * 0.8;
        const c = b.color;
        const g = ctx!.createRadialGradient(x, y, 0, x, y, b.r);
        g.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.15)`);
        g.addColorStop(0.55, `rgba(${c.r},${c.g},${c.b},0.05)`);
        g.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
        ctx!.fillStyle = g;
        ctx!.fillRect(x - b.r, y - b.r, b.r * 2, b.r * 2);

        if (b.x > width + b.r) b.x = -b.r;
        if (b.x < -b.r) b.x = width + b.r;
        if (b.y > height + b.r) b.y = -b.r;
        if (b.y < -b.r) b.y = height + b.r;
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.02;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14400) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / 120) * 0.5;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }

        if (p.y < -12) {
          p.y = height + 12;
          p.x = rand(0, width);
        }
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;

        const a = p.alpha * (0.55 + Math.sin(p.tw) * 0.45);
        const c = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${c.r},${c.g},${c.b},${a})`;
        ctx!.fill();
      }

      ctx!.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 8100) {
            const alpha = (1 - d2 / 8100) * 0.16;
            ctx!.strokeStyle = `rgba(167,139,250,${alpha})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      if (mouse.active) {
        const g = ctx!.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        g.addColorStop(0, "rgba(139,92,246,0.10)");
        g.addColorStop(1, "rgba(139,92,246,0)");
        ctx!.fillStyle = g;
        ctx!.fillRect(mouse.x - 220, mouse.y - 220, 440, 440);
      }

      ctx!.globalCompositeOperation = "source-over";
    }

    function loop(t: number) {
      if (!running) return;
      render(t);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (reduced) {
        render(0);
        return;
      }
      running = true;
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) render(0);
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onMouseLeave = () => {
      mouse.active = false;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!reduced) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    start();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseout", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}


