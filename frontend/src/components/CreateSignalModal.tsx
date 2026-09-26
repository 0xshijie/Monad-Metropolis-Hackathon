import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { useMetropolis } from "../hooks/useMetropolis";

export function CreateSignalModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [uri, setUri] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const { address, connect } = useWallet();
  const { createSignal, demoMode } = useMetropolis();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function submit() {
    if (!name.trim()) {
      setNote("Give your signal a name");
      return;
    }
    if (!address) {
      await connect();
      return;
    }
    setBusy(true);
    setNote(null);
    try {
      const meta = uri.trim() || `ipfs://metropolis/${encodeURIComponent(name.trim().toLowerCase())}`;
      await createSignal(name.trim(), meta);
      setOpen(false);
      setName("");
      setUri("");
    } catch (e) {
      setNote((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary">
        <Plus className="h-4 w-4" />
        Create Signal
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 px-4 backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-lg rounded-3xl glass-strong p-6 shadow-glow"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-signal-title"
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h2 id="create-signal-title" className="font-display text-2xl font-bold text-frost">
                    Create a Signal
                  </h2>
                  <p className="mt-1 text-sm text-fog">Mint a cultural moment for the crowd to boost.</p>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-fog hover:bg-violet/10 hover:text-frost" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <label htmlFor="signal-name" className="mb-2 block text-xs uppercase tracking-widest text-fog">
                Name <span className="text-danger">*</span>
              </label>
              <input
                id="signal-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={64}
                placeholder="e.g. GMONAD"
                className="input mb-4"
                autoFocus
              />

              <label htmlFor="signal-uri" className="mb-2 block text-xs uppercase tracking-widest text-fog">
                Metadata URI (optional)
              </label>
              <input
                id="signal-uri"
                value={uri}
                onChange={(e) => setUri(e.target.value)}
                maxLength={256}
                placeholder="ipfs://… or https://…"
                className="input mb-5"
              />

              {note ? <p className="mb-4 text-sm text-lilac">{note}</p> : null}

              <button onClick={submit} disabled={busy || !name.trim()} className="btn-primary w-full">
                {busy ? "Minting…" : demoMode ? "Connect to mint" : "Mint Signal"}
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
