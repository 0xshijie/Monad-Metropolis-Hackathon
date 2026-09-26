import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { DEMO_TICKER } from "../lib/demo";

export function Ticker() {
  const items = [...DEMO_TICKER, ...DEMO_TICKER];
  return (
    <div className="relative border-y border-line/70 bg-panel/60 py-2.5 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-ink to-transparent" />
      <div className="flex overflow-hidden">
        <motion.div
          className="flex min-w-full shrink-0 items-center gap-8 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {items.map((t, i) => (
            <span key={i} className="mono-num flex items-center gap-2 text-xs text-fog">
              <Activity className="h-3.5 w-3.5 text-gold" />
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
