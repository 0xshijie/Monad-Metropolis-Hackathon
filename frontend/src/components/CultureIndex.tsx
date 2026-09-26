import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrendingUp, UserRound } from "lucide-react";
import { useMetropolis } from "../hooks/useMetropolis";
import { formatMomentum, formatMon, shortAddr } from "../lib/format";
import { Sparkline } from "./Sparkline";
import { SectionHeading } from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const RANK_COLOR = ["text-gold", "text-lilac", "text-violet", "text-fog"];

export function CultureIndex() {
  const { signals } = useMetropolis();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const top = useMemo(() => {
    const list = [...signals].sort((a, b) => (b.momentum > a.momentum ? 1 : -1));
    return list.slice(0, 6);
  }, [signals]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || top.length === 0) return;

    const ctx = gsap.context(() => {
      const amount = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -amount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${amount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [top.length]);

  if (!top.length) return null;

  return (
    <section
      id="index"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: "100vh" }}
    >
      <div className="flex h-screen w-full items-center">
        <div className="flex items-center gap-10 pl-[6vw] pr-[12vw] sm:gap-16 lg:pl-[7vw]">
          <div className="shrink-0 lg:max-w-md">
            <SectionHeading
              kicker="Culture Index"
              kickerColor="#FBBF24"
              title="The signals shaping the moment."
              description="A live ranking of what the crowd is paying attention to. Scroll to move through the cultural feed."
            />
            <p className="mt-6 hidden items-center gap-2 text-xs uppercase tracking-[0.24em] text-fog lg:flex">
              <TrendingUp className="h-4 w-4 text-gold" /> Keep scrolling — the index slides sideways
            </p>
          </div>

          <div ref={trackRef} className="pinned-scroll flex shrink-0 items-center gap-6">
            {top.map((s, i) => {
              const spark = s.spark?.map(Number) ?? [Number(s.momentum) * 0.5, Number(s.momentum)];
              return (
                <article
                  key={s.id}
                  className="gradient-border relative h-[380px] w-[290px] shrink-0 overflow-hidden rounded-[2rem] p-6 shadow-glow sm:h-[420px] sm:w-[320px]"
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet/20 blur-3xl" />
                  <div className="flex items-start justify-between">
                    <span className={`font-serif-display text-6xl leading-none ${RANK_COLOR[i] ?? "text-fog"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="chip border-gold/40 bg-gold/10 text-gold">● live</span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-frost">{s.name}</h3>
                  <p className="mono-num mt-1 flex items-center gap-1.5 text-xs text-fog">
                    <UserRound className="h-3 w-3" /> {shortAddr(s.creator, 4)}
                  </p>

                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-fog">Momentum</div>
                      <div className="mono-num mt-1 text-xl font-bold text-frost">{formatMomentum(s.momentum)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest text-fog">Pool</div>
                      <div className="mono-num mt-1 text-xl font-bold text-gold">{formatMon(s.pool)} MON</div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Sparkline data={spark} width={260} height={60} color={i === 0 ? "#FBBF24" : "#A78BFA"} />
                  </div>
                </article>
              );
            })}

            <div className="flex h-[380px] w-[260px] shrink-0 flex-col items-start justify-center rounded-[2rem] border border-line/60 bg-panel/40 p-6 backdrop-blur-xl sm:h-[420px]">
              <p className="font-serif-display text-2xl leading-tight text-frost">
                Mint a Signal.
                <br />
                <span className="serif-gold">Earn the crowd.</span>
              </p>
              <a href="#live" className="btn-glow mt-6 !px-6 !py-3 text-sm">
                Enter the market
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
