import { Github, Radio } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-line/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-panel2/70">
                <Radio className="h-4 w-4 text-gold" />
              </span>
              <span className="font-display text-lg font-bold text-frost">
                MONAD<span className="text-violet">//</span>METROPOLIS
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-fog">
              A social attention market for the Monad Metropolis Hackathon — Social Attention &
              Culture track. Attention is the currency of culture.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <a href="#live" className="text-fog transition-colors hover:text-frost">Live Signals</a>
            <a href="#leaderboard" className="text-fog transition-colors hover:text-frost">Leaderboard</a>
            <a href="#how" className="text-fog transition-colors hover:text-frost">Mechanics</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://testnet.monadexplorer.com"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost !px-4 !py-2 text-xs"
            >
              Monad Testnet Explorer
            </a>
            <span className="btn-ghost !px-4 !py-2 text-xs">
              <Github className="h-4 w-4" /> Source
            </span>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line/50 pt-6 text-xs text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>Built for the Monad Metropolis Hackathon · 2026</p>
          <p className="mono-num">chainId 10143 · Monad Testnet</p>
        </div>
      </div>
    </footer>
  );
}
