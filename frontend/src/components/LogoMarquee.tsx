import type { ReactNode } from "react";
import { Marquee } from "./Marquee";
import { useMetropolis } from "../hooks/useMetropolis";

const SEP = <span className="serif-gold mx-6 sm:mx-10">✦</span>;

export function LogoMarquee() {
  const { signals } = useMetropolis();
  const names = (signals.length ? signals.map((s) => s.name) : ["Monad", "Gmonad", "Choyen", "NADS", "Metropolis"]).slice(0, 8);

  const row = (children: ReactNode) => (
    <div className="flex items-center">{children}</div>
  );

  return (
    <section aria-hidden="true" className="relative border-y border-line/60 bg-ink/40 py-10 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-ink to-transparent" />

      <Marquee duration={36} className="mb-6">
        {row(
          names.map((n, i) => (
            <span key={i} className="flex items-center">
              <span className="font-serif-display text-4xl italic text-fog/35 transition-colors hover:text-frost sm:text-6xl">
                {n}
              </span>
              {SEP}
            </span>
          )),
        )}
      </Marquee>

      <Marquee duration={44} reverse>
        {row(
          ["Attention", "Culture", "Momentum", "On-chain", "Community"].map((n, i) => (
            <span key={i} className="flex items-center">
              <span className="font-display text-xs uppercase tracking-[0.35em] text-fog/40">{n}</span>
              <span className="mx-6 text-gold/50">•</span>
            </span>
          )),
        )}
      </Marquee>
    </section>
  );
}
