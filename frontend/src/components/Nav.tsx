import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import ShinyText from "../lib/ui/ShinyText";
import { ConnectButton } from "./ConnectButton";

const links = [
  { href: "#live", label: "Market" },
  { href: "#leaderboard", label: "Rank" },
  { href: "#how", label: "How" },
  { href: "#activity", label: "Feed" },
  { href: "#portfolio", label: "You" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-line/70 bg-ink/75 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-panel2/70 shadow-glow">
            <Radio className="h-4 w-4 text-gold" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold shadow-glow-gold" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-frost">
            MONAD<span className="text-violet">//</span>
            <ShinyText text="METROPOLIS" speed={2.5} color="#F8FAFC" shineColor="#FBBF24" />
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-fog transition-colors hover:bg-violet/10 hover:text-frost"
            >
              {l.label}
            </a>
          ))}
        </div>

        <ConnectButton compact />
      </nav>
    </header>
  );
}

