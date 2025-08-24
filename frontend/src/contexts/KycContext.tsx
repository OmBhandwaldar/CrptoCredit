"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface KycContextType {
  kycCompleted: boolean;
  setKycCompleted: (val: boolean) => void;
  walletConnected: boolean;
  setWalletConnected: (val: boolean) => void;
}

const KycContext = createContext<KycContextType | undefined>(undefined);

export function KycProvider({ children }: { children: ReactNode }) {
  const [kycCompleted, setKycCompleted] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  return (
    <KycContext.Provider
      value={{ kycCompleted, setKycCompleted, walletConnected, setWalletConnected }}
    >
      {children}
    </KycContext.Provider>
  );
}

export function useKyc() {
  const context = useContext(KycContext);
  if (!context) {
    throw new Error("useKyc must be used inside KycProvider");
  }
  return context;
}
