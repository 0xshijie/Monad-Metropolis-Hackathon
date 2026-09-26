import { useState } from "react";
import { LogOut, PlugZap, Wallet } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { shortAddr } from "../lib/format";

export function ConnectButton({ compact = false }: { compact?: boolean }) {
  const { address, connecting, connect, disconnect, error } = useWallet();
  const [open, setOpen] = useState(false);

  if (!address) {
    return (
      <button onClick={connect} disabled={connecting} className="btn-primary">
        <PlugZap className="h-4 w-4" />
        {connecting ? "Connecting…" : "Connect Wallet"}
        {error ? <span className="sr-only">{error}</span> : null}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost !px-4 !py-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <Wallet className="h-4 w-4 text-lilac" />
        <span className="mono-num">{compact ? shortAddr(address, 3) : shortAddr(address, 4)}</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl glass-strong shadow-glow">
          <div className="border-b border-line px-4 py-3">
            <p className="text-[11px] uppercase tracking-widest text-fog">Connected to</p>
            <p className="mt-1 text-sm font-semibold text-frost">Monad Testnet</p>
            <p className="mono-num mt-0.5 break-all text-xs text-fog">{shortAddr(address, 8)}</p>
          </div>
          <button
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-frost transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </button>
        </div>
      ) : null}
    </div>
  );
}
