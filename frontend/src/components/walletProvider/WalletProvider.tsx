"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

export default function WalletProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={false}
      optInWallets={["Petra"]} // 👈 explicitly opt-in Petra
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
