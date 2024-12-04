"use client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

export interface SolWallet {
  privateKey: string;
  publicKey: string;
}

export interface SolWalletContextType {
  isInitialized: boolean;
  wallet: SolWallet | null;
  balance: number;
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
  balance: 0,
});

export const SolWalletProvider = ({
  rpcUrl,
  children,
}: PropsWithChildren<{ rpcUrl: string }>) => {
  const connection = useMemo(() => new Connection(rpcUrl), [rpcUrl]);

  const [wallet, setWallet] = useState<SolWallet | null>(null);
  const [balance, setBalance] = useState<number>(0);

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

  useEffect(() => {
    (async () => {
      if (!wallet?.publicKey) return;

      const publicKey = new PublicKey(wallet?.publicKey!);
      const balance = await connection.getBalance(publicKey);

      setBalance(balance);
    })();
  }, [wallet?.publicKey, connection]);

  return (
    <SolWalletContext.Provider
      value={{
        wallet,
        isInitialized,
        generateWallet,
        importWallet,
        deleteWallet,
        balance,
      }}
    >
      {children}
    </SolWalletContext.Provider>
  );
};

export const useSolWallet = () => useContext(SolWalletContext);
