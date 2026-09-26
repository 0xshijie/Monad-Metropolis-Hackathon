import { motion } from "framer-motion";
import { Activity, Coins, HeartHandshake, Radio } from "lucide-react";
import { formatEther } from "ethers";
import CountUp from "../lib/ui/CountUp";
import { useMetropolis } from "../hooks/useMetropolis";

function toNum(v: bigint | number): number {
  return typeof v === "bigint" ? Number(formatEther(v)) : Number(v);
}

function compactMon(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

export function StatsBar() {
  const { stats } = useMetropolis();

  const items = [
    { icon: Radio, label: "Live signals", num: Number(stats.signals), color: "text-violet", fmt: (n: number) => String(Math.round(n)) },
    { icon: Coins, label: "Attention locked", num: toNum(stats.pool), color: "text-gold", fmt: (n: number) => `${compactMon(n)} MON` },
    { icon: Activity, label: "Total volume", num: toNum(stats.volume), color: "text-lilac", fmt: (n: number) => `${compactMon(n)} MON` },
    { icon: HeartHandshake, label: "Creator tips", num: toNum(stats.tips), color: "text-fuchsia-300", fmt: (n: number) => `${compactMon(n)} MON` },
  ];

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 sm:px-6 lg:grid-cols-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="glass rounded-2xl p-4 text-left"
        >
          <item.icon className={`h-5 w-5 ${item.color}`} />
          <div className="mono-num mt-3 text-xl font-bold text-frost">
            <CountUp to={item.num} duration={1.8} formatter={item.fmt} />
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-widest text-fog">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
