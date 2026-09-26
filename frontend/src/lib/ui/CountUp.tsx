import { useEffect, useRef } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  delay?: number;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
}

export default function CountUp({
  to,
  from = 0,
  delay = 0,
  duration = 1.8,
  className = "",
  formatter,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fmt = formatter ?? ((n: number) => String(n));
    const start = typeof from === "number" && !Number.isNaN(from) ? from : 0;
    const end = typeof to === "number" && !Number.isNaN(to) ? to : 0;

    el.textContent = fmt(start);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = fmt(end);
      return;
    }

    let raf = 0;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime - delay * 1000;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, elapsed / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(start + (end - start) * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, from, delay, duration, formatter]);

  return <span className={className} ref={ref} />;
}
