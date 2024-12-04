"use client";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Keypair } from "@solana/web3.js";

export interface SolWallet {
  privateKey: string;
  publicKey: string;
}

export interface SolWalletContextType {
  isInitialized: boolean;
  wallet: SolWallet | null;
  generateWallet: () => void;
  importWallet: (privateKey: string) => void;
  deleteWallet: () => void;
}

const SolWalletContext = createContext<SolWalletContextType>({
  isInitialized: false,
  wallet: null,
  generateWallet: () => {},
  importWallet: () => {},
  deleteWallet: () => {},
});

export const SolWalletProvider = ({ children }: PropsWithChildren) => {
  const [wallet, setWallet] = useState<SolWallet | null>(null);

  const isInitialized = !!wallet;

  const generateWallet = () => {
    const keyPair = Keypair.generate();

    const publicKey = keyPair.publicKey.toBase58();
    const privateKey = Buffer.from(keyPair.secretKey).toString("hex");

    setWallet({ publicKey, privateKey });
  };

  const importWallet = (privateKey: string) => {
    const keyPair = Keypair.fromSecretKey(
      Uint8Array.from(Buffer.from(privateKey, "hex"))
    );

    const publicKey = keyPair.publicKey.toBase58();

    setWallet({ publicKey, privateKey });
  };

  const deleteWallet = () => {
    setWallet(null);
  };

  return (
    <SolWalletContext.Provider
      value={{
        wallet,
        isInitialized,
        generateWallet,
        importWallet,
        deleteWallet,
      }}
    >
      {children}
    </SolWalletContext.Provider>
  );
};

export const useSolWallet = () => useContext(SolWalletContext);
