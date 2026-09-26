import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpRight, Flame, Plus } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { useWallet } from "../context/WalletContext";
import { shortAddr, formatMon, timeAgo } from "../lib/format";

interface Activity {
  id: string;
  type: "created" | "boost" | "unboost" | "tip";
  label: string;
  amount: string;
  from: string;
  time: number;
}

const DEMO: Activity[] = [
  { id: "1", type: "boost", label: "GMONAD", amount: "1.2 MON", from: "0x8f3C…A063", time: Date.now() / 1000 - 12 },
  { id: "2", type: "tip", label: "Choyen", amount: "0.4 MON", from: "0x2bB1…F441", time: Date.now() / 1000 - 47 },
  { id: "3", type: "created", label: "NADS", amount: "", from: "0x1fB9…77e2", time: Date.now() / 1000 - 95 },
  { id: "4", type: "unboost", label: "Monad", amount: "0.8 MON", from: "0x8f3C…A063", time: Date.now() / 1000 - 160 },
  { id: "5", type: "boost", label: "Monarch", amount: "2.0 MON", from: "0x44Dd…9AA2", time: Date.now() / 1000 - 240 },
];

function iconFor(type: Activity["type"]) {
  if (type === "boost") return <Flame className="h-4 w-4 text-gold" />;
  if (type === "tip") return <ArrowUpRight className="h-4 w-4 text-fuchsia-300" />;
  if (type === "created") return <Plus className="h-4 w-4 text-violet" />;
  return <ArrowDownToLine className="h-4 w-4 text-lilac" />;
}

export function ActivityFeed() {
  const { contract } = useWallet();
  const [items, setItems] = useState<Activity[]>(DEMO);

  useEffect(() => {
    if (!contract) {
      setItems(DEMO);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const runnerProvider = contract.runner?.provider;
        const latest = runnerProvider ? Number(await runnerProvider.getBlockNumber()) : 0;
        const fromBlock = Math.max(0, latest - 4000);
        const [created, boosted, unboosted, tipped] = await Promise.all([
          contract.queryFilter("SignalCreated", fromBlock),
          contract.queryFilter("Boosted", fromBlock),
          contract.queryFilter("Unboosted", fromBlock),
          contract.queryFilter("Tipped", fromBlock),
        ]);

        const parsed: Activity[] = [
          ...created.map((e: any) => ({
            id: e.transactionHash,
            type: "created" as const,
            label: e.args?.name ?? `#${e.args?.id?.toString()}`,
            amount: "",
            from: e.args?.creator ?? "",
            time: 0,
          })),
          ...boosted.map((e: any) => ({
            id: e.transactionHash,
            type: "boost" as const,
            label: `Signal #${e.args?.id?.toString()}`,
            amount: formatMon(e.args?.amount ?? 0n),
            from: e.args?.user ?? "",
            time: 0,
          })),
          ...unboosted.map((e: any) => ({
            id: e.transactionHash,
            type: "unboost" as const,
            label: `Signal #${e.args?.id?.toString()}`,
            amount: formatMon(e.args?.payout ?? 0n),
            from: e.args?.user ?? "",
            time: 0,
          })),
          ...tipped.map((e: any) => ({
            id: e.transactionHash,
            type: "tip" as const,
            label: `Signal #${e.args?.id?.toString()}`,
            amount: formatMon(e.args?.amount ?? 0n),
            from: e.args?.from ?? "",
            time: 0,
          })),
        ];

        // queryFilter does not always expose block timestamps; sort by insertion order instead.
        parsed.sort((a, b) => String(b.id).localeCompare(String(a.id)));
        if (!cancelled) setItems(parsed.slice(0, 12));
      } catch (e) {
        console.warn("activity load failed", e);
        if (!cancelled) setItems(DEMO);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [contract]);

  return (
    <section id="activity" className="snap-section mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 flex justify-center text-center">
        <SectionHeading
          align="center"
          kicker="On-chain pulse"
          kickerColor="#A78BFA"
          title="The culture feed."
          description="Every mint, boost, exit, and tip as it happens on Monad Testnet."
        />
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
            className="flex items-center gap-3 rounded-2xl border border-line/70 bg-panel/70 px-4 py-3 backdrop-blur-xl"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-panel2/80">{iconFor(item.type)}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-frost">{item.label}</p>
              <p className="mono-num truncate text-xs text-fog">
                {item.type} · by {shortAddr(item.from, 4)}
              </p>
            </div>
            <div className="text-right">
              <div className="mono-num text-sm font-semibold text-frost">{item.amount || "—"}</div>
              {item.time ? <div className="text-[10px] text-fog">{timeAgo(item.time)}</div> : null}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}




