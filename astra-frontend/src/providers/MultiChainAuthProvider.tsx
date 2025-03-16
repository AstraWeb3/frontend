"use client"

import { ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

interface MultiChainAuthProviderProps {
  children: ReactNode;
}

export const MultiChainAuthProvider = ({ children }: MultiChainAuthProviderProps) => {
  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}
