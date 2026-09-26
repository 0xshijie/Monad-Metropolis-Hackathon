import { useCallback, useEffect, useState } from "react";
import { parseEther } from "ethers";
import { useWallet } from "../context/WalletContext";
import type { SignalSummary } from "../lib/types";
import { DEMO_SIGNALS } from "../lib/demo";

export interface MetropolisStats {
  volume: bigint;
  pool: bigint;
  tips: bigint;
  signals: bigint;
}

interface MetropolisState {
  signals: SignalSummary[];
  stats: MetropolisStats;
  demoMode: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  boost: (id: bigint, amount: string) => Promise<void>;
  unboost: (id: bigint, shares: bigint) => Promise<void>;
  tip: (id: bigint, amount: string) => Promise<void>;
  createSignal: (name: string, uri: string) => Promise<void>;
  claimFees: (id: bigint) => Promise<void>;
}

const DEMO_STATS: MetropolisStats = {
  volume: 91_400_000n * 10n ** 18n,
  pool: 41_200_000n * 10n ** 18n,
  tips: 1_180_000n * 10n ** 18n,
  signals: 8n,
};

export function useMetropolis(): MetropolisState {
  const { contract, address } = useWallet();
  const [signals, setSignals] = useState<SignalSummary[]>([]);
  const [stats, setStats] = useState<MetropolisStats>(DEMO_STATS);
  const [loading, setLoading] = useState(false);

  const demoMode = !contract;

  const load = useCallback(async () => {
    if (!contract) {
      setSignals(DEMO_SIGNALS as SignalSummary[]);
      setStats(DEMO_STATS);
      return;
    }
    setLoading(true);
    try {
      const [raw, totalVolume, totalPool, totalTips, nextSignalId] = await Promise.all([
        contract.topSignals(40),
        contract.totalVolume(),
        contract.totalPool(),
        contract.totalTips(),
        contract.nextSignalId(),
      ]);

      const enriched: SignalSummary[] = [];
      for (const s of raw) {
        let myShares = 0n;
        let totalShares = 0n;
        let pendingCreatorFees = 0n;
        let uri = "";
        let createdAt = 0n;
        try {
          if (address) myShares = await contract.getShares(s.id, address);
        } catch {
          myShares = 0n;
        }
        try {
          const detail = await contract.signal(s.id);
          totalShares = detail.totalShares ?? 0n;
          pendingCreatorFees = detail.pendingCreatorFees ?? 0n;
          uri = detail.uri ?? "";
        } catch {
          totalShares = 0n;
        }
        try {
          createdAt = await contract.createdAt(s.id);
        } catch {
          createdAt = 0n;
        }
        enriched.push({
          id: s.id,
          name: s.name,
          momentum: s.momentum,
          pool: s.pool,
          creator: s.creator,
          active: s.active,
          myShares,
          totalShares,
          pendingCreatorFees,
          uri,
          createdAt,
        });
      }

      setSignals(enriched);
      setStats({ volume: totalVolume, pool: totalPool, tips: totalTips, signals: nextSignalId - 1n });
    } catch (e) {
      console.warn("load failed", e);
      setSignals(DEMO_SIGNALS as SignalSummary[]);
      setStats(DEMO_STATS);
    } finally {
      setLoading(false);
    }
  }, [contract, address]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!contract) return;
    const onEvent = () => void load();
    try {
      contract.on("SignalCreated", onEvent);
      contract.on("Boosted", onEvent);
      contract.on("Unboosted", onEvent);
      contract.on("Tipped", onEvent);
      contract.on("CreatorFeesClaimed", onEvent);
    } catch {
      // Event subscriptions are best-effort.
    }
    return () => {
      contract.off("SignalCreated", onEvent);
      contract.off("Boosted", onEvent);
      contract.off("Unboosted", onEvent);
      contract.off("Tipped", onEvent);
      contract.off("CreatorFeesClaimed", onEvent);
    };
  }, [contract, load]);

  const boost = useCallback(
    async (id: bigint, amount: string) => {
      if (!contract) throw new Error("Wallet not connected");
      const tx = await contract.boost(id, { value: parseEther(amount || "0") });
      await tx.wait();
      await load();
    },
    [contract, load],
  );

  const unboost = useCallback(
    async (id: bigint, shares: bigint) => {
      if (!contract) throw new Error("Wallet not connected");
      const tx = await contract.unboost(id, shares);
      await tx.wait();
      await load();
    },
    [contract, load],
  );

  const tip = useCallback(
    async (id: bigint, amount: string) => {
      if (!contract) throw new Error("Wallet not connected");
      const tx = await contract.tip(id, { value: parseEther(amount || "0") });
      await tx.wait();
      await load();
    },
    [contract, load],
  );

  const createSignal = useCallback(
    async (name: string, uri: string) => {
      if (!contract) throw new Error("Wallet not connected");
      const tx = await contract.createSignal(name, uri);
      await tx.wait();
      await load();
    },
    [contract, load],
  );

  const claimFees = useCallback(
    async (id: bigint) => {
      if (!contract) throw new Error("Wallet not connected");
      const tx = await contract.claimCreatorFees(id);
      await tx.wait();
      await load();
    },
    [contract, load],
  );

  return { signals, stats, demoMode, loading, refresh: load, boost, unboost, tip, createSignal, claimFees };
}
