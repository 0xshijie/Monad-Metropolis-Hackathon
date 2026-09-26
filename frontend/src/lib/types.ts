export interface SignalSummary {
  id: bigint;
  name: string;
  momentum: bigint;
  pool: bigint;
  creator: string;
  active: boolean;
  uri?: string;
  totalShares?: bigint;
  pendingCreatorFees?: bigint;
  myShares?: bigint;
  createdAt?: bigint;
  lastUpdated?: number;
  spark?: number[];
}

export interface PortfolioRow {
  id: bigint;
  name: string;
  shares: bigint;
  value: bigint;
  creator: string;
}
