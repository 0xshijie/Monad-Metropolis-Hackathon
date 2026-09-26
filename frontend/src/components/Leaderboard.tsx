import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { SignalSummary } from "../lib/types";
import { formatMon, formatMomentum, shortAddr } from "../lib/format";
import { Sparkline } from "./Sparkline";
import { SectionHeading } from "./SectionHeading";

interface Props {
  signals: SignalSummary[];
}

export function Leaderboard({ signals }: Props) {
  const [mode, setMode] = useState<"momentum" | "pool">("momentum");

  const top = useMemo(() => {
    const list = [...signals];
    list.sort((a, b) => (mode === "pool" ? (b.pool > a.pool ? 1 : -1) : b.momentum > a.momentum ? 1 : -1));
    return list.slice(0, 10);
  }, [signals, mode]);

  const max = mode === "pool" ? top[0]?.pool ?? 0n : top[0]?.momentum ?? 0n;

  return (
    <section id="leaderboard" className="snap-section mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          kicker="Cultural capital index"
          kickerColor="#FBBF24"
          title="Who owns the moment."
          description="The live ranking of what culture is compounding right now — measured in momentum and locked MON."
        />
        <div className="flex rounded-xl border border-line bg-panel2/40 p-1">
          {(["momentum", "pool"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === m ? "bg-gold text-ink" : "text-fog hover:text-frost"
              }`}
            >
              {m === "momentum" ? "By momentum" : "By MON locked"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {top.map((s, i) => {
          const value = mode === "pool" ? s.pool : s.momentum;
          const pct = max > 0n ? Number((value * 10000n) / max) / 100 : 0;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="flex items-center gap-4 rounded-2xl border border-line/70 bg-panel/70 p-4 backdrop-blur-xl transition-colors hover:border-violet/60"
            >
              <div className={`font-display text-2xl font-bold ${i === 0 ? "text-gold" : i === 1 ? "text-lilac" : i === 2 ? "text-violet" : "text-fog"}`}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate font-display text-base font-bold text-frost">{s.name}</h3>
                  <span className="mono-num text-sm text-frost">
                    {mode === "pool" ? formatMon(value) : formatMomentum(value)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-fog">
                  <span className="mono-num truncate">by {shortAddr(s.creator, 4)}</span>
                  <span className="mono-num">{formatMon(s.pool)} MON</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-panel2">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet to-gold" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <Sparkline data={s.spark?.map(Number) ?? [1, 2]} width={90} height={32} color={i === 0 ? "#FBBF24" : "#8B5CF6"} />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
