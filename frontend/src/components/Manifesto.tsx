import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT =
  "Attention is fleeting. Culture compounds. The crowd decides what deserves to live on-chain.";

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const words = STATEMENT.split(" ");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".manifesto-word",
        { opacity: 0.08, filter: "blur(10px)", y: 18, rotateX: -12 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          rotateX: 0,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 0.5,
          },
        },
      );

      gsap.fromTo(
        ".manifesto-ornament",
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=30%",
            scrub: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative flex h-screen items-center justify-center overflow-hidden px-6"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/15 blur-[120px]" />
        <div className="absolute right-[8%] top-[12%] h-56 w-56 rounded-full bg-gold/10 blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-5xl text-center">
        <p className="manifesto-ornament mb-8 text-xs font-semibold uppercase tracking-[0.32em] text-gold">
          The thesis
        </p>
        <p className="font-serif-display text-[clamp(2rem,5vw,4.4rem)] leading-[1.12] text-frost">
          {words.map((word, i) => (
            <span
              key={i}
              className="manifesto-word inline-block will-change-transform"
              style={{ paddingRight: "0.24em" }}
            >
              {word}
            </span>
          ))}
        </p>
        <div className="manifesto-ornament mx-auto mt-12 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.24em] text-fog">
          <span className="mono-num text-gold">2.5% platform</span>
          <span className="h-px w-10 bg-line" />
          <span className="mono-num text-lilac">5% creator</span>
          <span className="h-px w-10 bg-line" />
          <span className="mono-num text-fuchsia-300">~17% daily decay</span>
        </div>
      </div>
    </section>
  );
}
