import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, HandCoins, Layers, WalletMinimal } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { useWallet } from "../context/WalletContext";
import { useMetropolis } from "../hooks/useMetropolis";
import { formatMon, formatMomentum, shortAddr } from "../lib/format";

export function Portfolio() {
  const { address } = useWallet();
  const { signals, claimFees } = useMetropolis();
  const [busyId, setBusyId] = useState<bigint | null>(null);

  const mine = signals.filter((s) => s.myShares && s.myShares > 0n);
  const created = signals.filter((s) => address && s.creator.toLowerCase() === address.toLowerCase());

  const totalValue = mine.reduce((acc, s) => {
    if (!s.totalShares || !s.pool || !s.myShares) return acc;
    return acc + Number(formatMon((s.myShares * s.pool) / s.totalShares, 6));
  }, 0);

  return (
    <section id="portfolio" className="snap-section mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8">
        <SectionHeading
          kicker="Your cultural capital"
          kickerColor="#A78BFA"
          title="The attention you own."
          description="Attention shares, estimated MON value, and creator fees — everything you hold in one place."
        />
      </div>

      {!address ? (
        <div className="glass rounded-3xl p-10 text-center">
          <WalletMinimal className="mx-auto h-8 w-8 text-lilac" />
          <h3 className="mt-4 font-display text-2xl font-bold text-frost">Your attention portfolio</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-fog">
            Connect a wallet to see your attention shares, estimated MON value, and creator fee claims.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="glass rounded-2xl p-5">
              <Coins className="h-5 w-5 text-gold" />
              <div className="mono-num mt-3 text-2xl font-bold text-frost">{totalValue.toFixed(3)}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-fog">Estimated MON value</div>
            </div>
            <div className="glass rounded-2xl p-5">
              <Layers className="h-5 w-5 text-violet" />
              <div className="font-display mt-3 text-2xl font-bold text-frost">{mine.length}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-fog">Signals boosted</div>
            </div>
            <div className="glass rounded-2xl p-5">
              <HandCoins className="h-5 w-5 text-lilac" />
              <div className="font-display mt-3 text-2xl font-bold text-frost">{created.length}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-fog">Signals created</div>
            </div>
          </div>

          {mine.length ? (
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-fog">Attention shares</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {mine.map((s) => {
                  const value = s.totalShares && s.pool ? Number(formatMon((s.myShares! * s.pool) / s.totalShares, 6)) : 0;
                  return (
                    <motion.div
                      key={s.id}
                      layout
                      className="flex items-center justify-between rounded-2xl border border-line/70 bg-panel/70 p-4"
                    >
                      <div>
                        <div className="font-display font-bold text-frost">{s.name}</div>
                        <div className="mono-num mt-1 text-xs text-fog">
                          {formatMomentum(s.myShares!)} shares · {formatMon(s.pool)} MON pool
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="mono-num font-semibold text-frost">{value.toFixed(3)} MON</div>
                        <div className="text-[10px] uppercase tracking-widest text-fog">est. value</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {created.length ? (
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-fog">Creator fees earned</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {created.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-2xl border border-line/70 bg-panel/70 p-4">
                    <div>
                      <div className="font-display font-bold text-frost">{s.name}</div>
                      <div className="mono-num mt-1 text-xs text-fog">{formatMon(s.pendingCreatorFees ?? 0n, 6)} MON available</div>
                    </div>
                    <button
                      onClick={async () => {
                        setBusyId(s.id);
                        try {
                          await claimFees(s.id);
                        } finally {
                          setBusyId(null);
                        }
                      }}
                      disabled={busyId === s.id || !s.pendingCreatorFees}
                      className="btn-ghost !px-3 !py-2 text-xs"
                    >
                      {busyId === s.id ? "Claiming…" : "Claim"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <p className="mono-num mt-6 text-xs text-fog">Wallet · {shortAddr(address, 8)}</p>
        </>
      )}
    </section>
  );
}

