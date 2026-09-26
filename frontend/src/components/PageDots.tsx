import { useEffect, useState } from "react";

const sections = [
  { id: "top", label: "Intro" },
  { id: "manifesto", label: "Thesis" },
  { id: "index", label: "Index" },
  { id: "live", label: "Market" },
  { id: "leaderboard", label: "Rank" },
  { id: "how", label: "How" },
  { id: "activity", label: "Feed" },
  { id: "portfolio", label: "You" },
];

export function PageDots() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Page navigation" className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={s.label}
          className="group flex items-center justify-end gap-2"
        >
          <span className="pointer-events-none translate-x-2 text-[10px] uppercase tracking-widest text-fog opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
            {s.label}
          </span>
          <span
            className={`h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
              active === s.id
                ? "scale-125 border-gold bg-gold shadow-glow-gold"
                : "border-fog/60 bg-panel2 group-hover:border-lilac"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}

