import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { useWallet } from "../context/WalletContext";
import { useMetropolis } from "../hooks/useMetropolis";
import { SignalCard } from "./SignalCard";
import { CreateSignalModal } from "./CreateSignalModal";

type SortKey = "momentum" | "pool" | "newest";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "momentum", label: "Trending" },
  { key: "pool", label: "Most boosted" },
  { key: "newest", label: "Newest" },
];

export function LiveSignals() {
  const { address } = useWallet();
  const { signals, demoMode, loading, boost, unboost, tip } = useMetropolis();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("momentum");

  const filtered = useMemo(() => {
    let list = signals;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.creator.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sort === "pool") return b.pool > a.pool ? 1 : -1;
      if (sort === "newest") return (b.id ?? 0n) > (a.id ?? 0n) ? 1 : -1;
      return b.momentum > a.momentum ? 1 : -1;
    });
  }, [signals, query, sort]);

  const maxMomentum = filtered.reduce((m, s) => (s.momentum > m ? s.momentum : m), 0n);

  return (
    <section id="live" className="snap-section mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionHeading
            kicker="Streaming now"
            kickerColor="#A78BFA"
            title="Live Signals"
            description="Momentum is decaying in real time. Boost what deserves attention before it fades."
          />
        </div>
        <CreateSignalModal />
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search signal or creator…"
            className="input !pl-9"
            aria-label="Search signals"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-fog" />
          <div className="flex rounded-xl border border-line bg-panel2/40 p-1">
            {SORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  sort === s.key ? "bg-violet text-white shadow-glow" : "text-fog hover:text-frost"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {demoMode ? (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          Demo mode — connect a wallet to stake real testnet MON.
        </div>
      ) : null}

      {loading && signals.length === 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-3xl border border-line/60 bg-panel/60" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s, i) => (
            <SignalCard
              key={s.id}
              signal={s}
              rank={i + 1}
              maxMomentum={maxMomentum}
              demoMode={demoMode}
              onBoost={async (id, amount) => {
                if (!address) return;
                await boost(id, amount);
              }}
              onTip={async (id, amount) => {
                if (!address) return;
                await tip(id, amount);
              }}
              onUnboost={async (id) => {
                if (!s.myShares) return;
                await unboost(id, s.myShares);
              }}
            />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-12 text-center">
          <p className="font-display text-xl font-bold text-frost">No signals match</p>
          <p className="mt-2 text-sm text-fog">Try another search, or mint the first cultural moment.</p>
        </motion.div>
      ) : null}
    </section>
  );
}


