import type { SignalSummary } from "./types";

const E = 10n ** 18n;

const seed = [
  ["Monad", 8_400_000n * E, 12_600_000n * E, "#8B5CF6"],
  ["Gmonad", 6_900_000n * E, 9_100_000n * E, "#A78BFA"],
  ["Choyen", 5_300_000n * E, 7_800_000n * E, "#FBBF24"],
  ["NADS", 4_100_000n * E, 6_200_000n * E, "#34D399"],
  ["Metropolis", 3_600_000n * E, 5_100_000n * E, "#F472B6"],
  ["Monarch", 2_700_000n * E, 3_900_000n * E, "#60A5FA"],
  ["Molandak", 1_950_000n * E, 2_400_000n * E, "#FB7185"],
  ["Nads + Monad", 1_400_000n * E, 1_800_000n * E, "#C084FC"],
] as const;

function spark(momentum: number, seedIndex: number): number[] {
  const out: number[] = [];
  let v = momentum * 0.4;
  for (let i = 0; i < 24; i++) {
    const wave = Math.sin(i * 0.55 + seedIndex) * momentum * 0.08;
    const noise = Math.cos(i * 1.7 + seedIndex * 2) * momentum * 0.05;
    v = Math.max(momentum * 0.2, v + wave + noise + momentum * 0.02);
    out.push(v);
  }
  return out;
}

export const DEMO_SIGNALS: SignalSummary[] = seed.map(([name, momentum, pool], i) => ({
  id: BigInt(i + 1),
  name,
  momentum,
  pool,
  creator: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  active: true,
  uri: `ipfs://demo/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  totalShares: pool * 6n,
  spark: spark(Number(momentum) / 1e18, i),
}));

export const DEMO_TICKER = [
  "MONAD · momentum +18.2%",
  "GMONAD · a fresh wave is forming",
  "CHOYEN · creator fee claimed",
  "NADS · attention compounding",
  "METROPOLIS · culture is on-chain",
];
