import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Radar } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { useMetropolis } from "../hooks/useMetropolis";

interface PulseTerm {
  id: string;
  name: string;
  cat: string;
  momentum: number;
  delta: number;
}

const CATEGORIES = ["meme", "creator", "narrative", "community", "aesthetic"];

const FALLBACK: PulseTerm[] = [
  { id: "f1", name: "GMONAD", cat: "meme", momentum: 88, delta: 4 },
  { id: "f2", name: "choyen", cat: "creator", momentum: 74, delta: -2 },
  { id: "f3", name: "NADS", cat: "meme", momentum: 63, delta: 5 },
  { id: "f4", name: "attention is currency", cat: "narrative", momentum: 55, delta: 3 },
  { id: "f5", name: "on-chain memes", cat: "aesthetic", momentum: 41, delta: -1 },
  { id: "f6", name: "the crowd decides", cat: "narrative", momentum: 34, delta: 2 },
  { id: "f7", name: "cultural capital", cat: "community", momentum: 27, delta: -3 },
  { id: "f8", name: "Molandak", cat: "creator", momentum: 18, delta: 1 },
];

function tick(terms: PulseTerm[]): PulseTerm[] {
  return terms
    .map((t) => {
      const drift = (Math.random() - 0.45) * 7;
      const next = Math.max(6, Math.min(100, t.momentum + drift));
      return { ...t, momentum: next, delta: next - t.momentum };
    })
    .sort((a, b) => b.momentum - a.momentum);
}

export function CulturePulse() {
  const { signals } = useMetropolis();
  const [terms, setTerms] = useState<PulseTerm[]>(FALLBACK);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && signals.length) {
      initialized.current = true;
      const max = signals.reduce((m, s) => (s.momentum > m ? s.momentum : m), 0n);
      const base: PulseTerm[] = signals.slice(0, 8).map((s, i) => ({
        id: String(s.id),
        name: s.name,
        cat: CATEGORIES[i % CATEGORIES.length],
        momentum: max > 0n ? Math.round(Number((s.momentum * 10000n) / max) / 100) : 50,
        delta: 0,
      }));
      setTerms(base.length ? base : FALLBACK);
    }
  }, [signals]);

  useEffect(() => {
    const interval = setInterval(() => setTerms((prev) => tick(prev)), 2600);
    return () => clearInterval(interval);
  }, []);

  const max = terms.reduce((m, t) => Math.max(m, t.momentum), 1);

  return (
    <section id="pulse" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mb-12 flex justify-center text-center">
        <SectionHeading
          align="center"
          kicker="Culture pulse"
          kickerColor="#FBBF24"
          title="What the crowd is amplifying."
          description="A live radar of the words, creators, and narratives gaining cultural momentum right now."
        />
      </div>

      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="flex justify-center">
          <div className="relative aspect-square w-full max-w-[380px] rounded-full border border-line/50 bg-panel/20">
            <div className="absolute inset-[18%] rounded-full border border-line/40" />
            <div className="absolute inset-[36%] rounded-full border border-line/40" />
            <div className="absolute inset-[54%] rounded-full border border-line/30" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-line/30" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-line/30" />
            <div className="radar-sweep absolute inset-0 rounded-full" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-glow-gold" />
            <span className="absolute left-[16%] top-[28%] h-2 w-2 animate-ping rounded-full bg-violet" />
            <span className="absolute right-[22%] top-[40%] h-2 w-2 animate-ping rounded-full bg-fuchsia-400" />
            <span className="absolute bottom-[24%] left-[34%] h-1.5 w-1.5 animate-ping rounded-full bg-gold" />
          </div>
        </div>

        <div className="space-y-2">
          {terms.map((t, i) => {
            const pct = Math.max(4, (t.momentum / max) * 100);
            const up = t.delta >= 0;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="flex items-center gap-4 rounded-2xl border border-line/60 bg-panel/60 px-4 py-3 backdrop-blur-xl"
              >
                <span className={`mono-num w-6 shrink-0 text-sm ${i === 0 ? "text-gold" : i === 1 ? "text-lilac" : "text-fog"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-display text-base font-bold text-frost">{t.name}</h3>
                    <span className="chip !px-2 !py-0.5 !text-[10px]">{t.cat}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-panel2">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-violet to-gold"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="mono-num text-sm font-semibold text-frost">{Math.round(t.momentum)}</div>
                  <div className={`flex items-center justify-end gap-0.5 text-[11px] ${up ? "text-emerald-400" : "text-rose-400"}`}>
                    {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(t.delta).toFixed(1)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.24em] text-fog">
        <Radar className="h-4 w-4 text-gold" />
        Live · updates every few seconds
      </div>
    </section>
  );
}
