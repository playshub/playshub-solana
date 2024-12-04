"use client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
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

    localStorage.setItem("pv_key", privateKey);
    setWallet({ publicKey, privateKey });
  };

  const importWallet = (privateKey: string) => {
    const keyPair = Keypair.fromSecretKey(
      Uint8Array.from(Buffer.from(privateKey, "hex"))
    );

    const publicKey = keyPair.publicKey.toBase58();

    localStorage.setItem("pv_key", privateKey);
    setWallet({ publicKey, privateKey });
  };

  const deleteWallet = () => {
    localStorage.removeItem("pv_key");
    setWallet(null);
  };

  useEffect(() => {
    const privateKey = localStorage.getItem("pv_key");

    if (privateKey) {
      importWallet(privateKey);
    }
  }, []);

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
