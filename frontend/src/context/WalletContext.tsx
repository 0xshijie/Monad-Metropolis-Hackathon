import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract, Eip1193Provider, JsonRpcSigner } from "ethers";
import { METROPOLIS_ADDRESS, METROPOLIS_ABI } from "../lib/deployments";
import { MONAD_TESTNET } from "../lib/chain";

interface WalletState {
  address: string | null;
  chainId: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  contract: Contract | null;
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState | null>(null);

type Injected = Eip1193Provider & {
  on?: (e: string, cb: () => void) => void;
  removeListener?: (e: string, cb: () => void) => void;
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

function getInjected(): Injected | undefined {
  return (window as unknown as { ethereum?: Injected }).ethereum;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  const ethereum = getInjected();

  useEffect(() => {
    if (!ethereum) return;
    const reset = () => {
      setAddress(null);
      setSigner(null);
      setProvider(null);
      setChainId(null);
    };
    ethereum.on?.("accountsChanged", reset);
    ethereum.on?.("chainChanged", reset);
    return () => {
      ethereum.removeListener?.("accountsChanged", reset);
      ethereum.removeListener?.("chainChanged", reset);
    };
  }, [ethereum]);

  async function request(method: string, params?: unknown[]) {
    if (!ethereum?.request) throw new Error("Wallet provider not available");
    return ethereum.request({ method, params });
  }

  async function ensureNetwork() {
    const current = (await request("eth_chainId")) as string;
    if (current !== MONAD_TESTNET.chainId) {
      try {
        await request("wallet_switchEthereumChain", [{ chainId: MONAD_TESTNET.chainId }]);
      } catch (switchErr: unknown) {
        const code = (switchErr as { code?: number }).code;
        if (code === 4902) {
          await request("wallet_addEthereumChain", [MONAD_TESTNET]);
        } else {
          throw switchErr;
        }
      }
    }
  }

  async function connect() {
    if (!ethereum) {
      setError("No wallet detected. Install MetaMask or another EIP-1193 wallet.");
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      await ensureNetwork();
      const accounts = (await request("eth_requestAccounts")) as string[];
      const p = new BrowserProvider(ethereum);
      const s = await p.getSigner();
      const cid = (await request("eth_chainId")) as string;
      setProvider(p);
      setSigner(s);
      setAddress(accounts[0] ?? null);
      setChainId(cid);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setConnecting(false);
    }
  }

  function disconnect() {
    setAddress(null);
    setSigner(null);
    setProvider(null);
    setChainId(null);
  }

  const contract = useMemo(() => {
    if (!signer || METROPOLIS_ADDRESS === "0x0000000000000000000000000000000000000000") return null;
    return new Contract(METROPOLIS_ADDRESS, METROPOLIS_ABI, signer);
  }, [signer]);

  return (
    <WalletContext.Provider
      value={{ address, chainId, provider, signer, contract, connecting, error, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
