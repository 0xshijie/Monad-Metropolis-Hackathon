import { formatEther, parseEther } from "ethers";

export function shortAddr(address?: string, chars = 5): string {
  if (!address) return "—";
  return `${address.slice(0, 2 + chars)}…${address.slice(-chars)}`;
}

export function formatMon(value: bigint | number | string, digits = 4): string {
  const num = typeof value === "bigint" ? Number(formatEther(BigInt(value))) : Number(value);
  if (Number.isNaN(num)) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(digits - 2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(digits - 1)}K`;
  return num.toFixed(digits);
}

export function formatMomentum(value: bigint | number | string): string {
  const num = typeof value === "bigint" ? Number(formatEther(BigInt(value))) : Number(value);
  if (Number.isNaN(num) || num === 0) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toFixed(2);
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toFixed(0);
}

export function parseMon(value: string): bigint {
  try {
    return parseEther(value || "0");
  } catch {
    return 0n;
  }
}

export function momentumPercent(value: bigint, max: bigint): number {
  if (max === 0n || value === 0n) return 0;
  const pct = Number((value * 10000n) / max) / 100;
  return Math.max(0, Math.min(100, pct));
}

export function timeAgo(ts: number): string {
  const seconds = Math.floor(Date.now() / 1000 - ts);
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
