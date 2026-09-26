import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Flame,
  HeartHandshake,
  Link2,
  Share2,
  Sparkles,
  TrendingDown,
  Twitter,
  UserRound,
} from "lucide-react";
import SpotlightCard from "../lib/ui/SpotlightCard";
import type { SignalSummary } from "../lib/types";
import { formatMon, formatMomentum, shortAddr, timeAgo } from "../lib/format";
import { Sparkline } from "./Sparkline";

interface Props {
  signal: SignalSummary;
  rank: number;
  maxMomentum: bigint;
  demoMode: boolean;
  onBoost: (id: bigint, amount: string) => Promise<void>;
  onUnboost: (id: bigint) => Promise<void>;
  onTip: (id: bigint, amount: string) => Promise<void>;
}

const RANK_COLORS = ["text-gold", "text-lilac", "text-violet", "text-fog"];

export function SignalCard({ signal, rank, maxMomentum, demoMode, onBoost, onUnboost, onTip }: Props) {
  const [open, setOpen] = useState<"boost" | "tip" | null>(null);
  const [amount, setAmount] = useState("0.05");
  const [busy, setBusy] = useState<"boost" | "unboost" | "tip" | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const pct = maxMomentum > 0n ? Number((signal.momentum * 10000n) / maxMomentum) / 100 : 0;
  const spark = signal.spark?.map(Number) ?? [Number(signal.momentum) * 0.6, Number(signal.momentum)];

  const shareText = `${signal.name} is at ${formatMomentum(signal.momentum)} momentum on MONAD//METROPOLIS. Attention is the currency of culture.`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      const el = document.createElement("textarea");
      el.value = shareText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  function handleShareX() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setShareOpen(false);
  }

  async function handleBoost() {
    setBusy("boost");
    setNote(null);
    try {
      await onBoost(signal.id, amount);
      setNote(demoMode ? "Demo boost simulated" : "Boost confirmed on Monad Testnet");
      setOpen(null);
    } catch (e) {
      setNote((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function handleTip() {
    setBusy("tip");
    setNote(null);
    try {
      await onTip(signal.id, amount);
      setNote(demoMode ? "Demo tip simulated" : "Tip sent to creator");
      setOpen(null);
    } catch (e) {
      setNote((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function handleUnboost() {
    if (!signal.myShares) return;
    setBusy("unboost");
    setNote(null);
    try {
      await onUnboost(signal.id);
      setNote("Shares withdrawn");
    } catch (e) {
      setNote((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <SpotlightCard
        spotlightColor="rgba(167, 139, 250, 0.28)"
        className="group gradient-border p-5 shadow-none transition-shadow duration-300 hover:shadow-glow"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lilac/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`font-display text-2xl font-bold ${RANK_COLORS[rank - 1] ?? "text-fog"}`}>
              {String(rank).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-xl font-bold tracking-tight text-frost">{signal.name}</h3>
              <p className="mono-num mt-0.5 flex items-center gap-1.5 text-xs text-fog">
                <UserRound className="h-3 w-3" />
                {shortAddr(signal.creator, 4)}
                {signal.createdAt ? (
                  <>
                    <span className="text-line">·</span>
                    {timeAgo(Number(signal.createdAt))}
                  </>
                ) : null}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="mono-num text-lg font-semibold text-frost">{formatMomentum(signal.momentum)}</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-widest text-fog">momentum</div>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <Sparkline data={spark} color={rank === 1 ? "#FBBF24" : "#A78BFA"} width={150} height={44} />
          <div className="mono-num text-right text-sm text-fog">
            <div className="text-xs uppercase tracking-widest">Pool</div>
            <div className="text-frost">{formatMon(signal.pool)} MON</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-fog">
            <span className="flex items-center gap-1 uppercase tracking-widest">
              <Flame className="h-3 w-3 text-gold" /> Attention share
            </span>
            <span className="mono-num">{pct.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-panel2">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet to-gold"
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.max(2, pct)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button onClick={() => setOpen(open === "boost" ? null : "boost")} className="btn-primary flex-1 !py-2.5">
            <Sparkles className="h-4 w-4" />
            Boost
          </button>
          <button
            onClick={() => setOpen(open === "tip" ? null : "tip")}
            className="btn-ghost !px-3 !py-2.5"
            aria-label={`Tip creator of ${signal.name}`}
          >
            <HeartHandshake className="h-4 w-4 text-fuchsia-300" />
            Tip
          </button>
          <div className="relative">
            <button
              onClick={() => setShareOpen((v) => !v)}
              className="btn-ghost !px-3 !py-2.5"
              aria-label={`Share ${signal.name}`}
              aria-expanded={shareOpen}
            >
              <Share2 className="h-4 w-4 text-lilac" />
            </button>
            <AnimatePresence>
              {shareOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  className="absolute bottom-full right-0 z-30 mb-2 w-52 overflow-hidden rounded-2xl glass-strong shadow-glow"
                >
                  <button
                    onClick={handleCopy}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-frost transition-colors hover:bg-violet/10"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Link2 className="h-4 w-4 text-lilac" />}
                    {copied ? "Copied" : "Copy share text"}
                  </button>
                  <button
                    onClick={handleShareX}
                    className="flex w-full items-center gap-2 border-t border-line/50 px-4 py-3 text-left text-sm text-frost transition-colors hover:bg-violet/10"
                  >
                    <Twitter className="h-4 w-4 text-sky-400" />
                    Share on X
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          {signal.myShares ? (
            <button onClick={handleUnboost} disabled={busy === "unboost"} className="btn-ghost !px-3 !py-2.5" aria-label="Exit position">
              <TrendingDown className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 rounded-2xl border border-line/70 bg-ink/60 p-4">
                <label htmlFor={`amount-${signal.id}-${open}`} className="mb-2 block text-xs uppercase tracking-widest text-fog">
                  {open === "boost" ? "Stake MON to boost" : "Send a tip to the creator"}
                </label>
                <div className="flex gap-2">
                  <input
                    id={`amount-${signal.id}-${open}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="decimal"
                    className="input mono-num"
                  />
                  <button
                    onClick={open === "boost" ? handleBoost : handleTip}
                    disabled={busy === "boost" || busy === "tip"}
                    className="btn-primary !px-4"
                  >
                    {busy === "boost" || busy === "tip" ? "…" : open === "boost" ? "Stake" : "Send"}
                  </button>
                </div>
                {signal.myShares ? (
                  <p className="mono-num mt-2 text-xs text-fog">
                    Your attention shares: {formatMomentum(signal.myShares)}
                  </p>
                ) : null}
                {note ? <p className="mt-2 text-xs text-lilac">{note}</p> : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {signal.uri ? (
          <a
            href={signal.uri.startsWith("http") ? signal.uri : `#signal-${signal.id}`}
            className="pointer-events-none absolute bottom-4 right-4 text-fog opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : null}
      </SpotlightCard>
    </motion.div>
  );
}
