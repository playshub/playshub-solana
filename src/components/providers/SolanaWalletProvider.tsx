"use client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import bs58 from "bs58";

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
  transferSol: (to: string, lamports: number, memo?: string) => Promise<void>;
}

const SolWalletContext = createContext<SolWalletContextType>({
  isInitialized: false,
  wallet: null,
  generateWallet: () => {},
  importWallet: () => {},
  deleteWallet: () => {},
  balance: 0,
  transferSol: async (to: string, lamports: number, memo?: string) => {},
});

export const SolWalletProvider = ({
  rpcUrl,
  children,
}: PropsWithChildren<{ rpcUrl: string }>) => {
  const connection = useMemo(
    () => new Connection(rpcUrl, "confirmed"),
    [rpcUrl]
  );

  const [wallet, setWallet] = useState<SolWallet | null>(null);
  const [balance, setBalance] = useState<number>(0);

  const isInitialized = !!wallet;

  const generateWallet = () => {
    const keyPair = Keypair.generate();

    const publicKey = keyPair.publicKey.toBase58();
    const privateKey = bs58.encode(keyPair.secretKey);

    localStorage.setItem("pv_key", privateKey);
    setWallet({ publicKey, privateKey });
  };

  const importWallet = (privateKey: string) => {
    const keyPair = Keypair.fromSecretKey(bs58.decode(privateKey));

    const publicKey = keyPair.publicKey.toBase58();

    localStorage.setItem("pv_key", privateKey);
    setWallet({ publicKey, privateKey });
  };

  const deleteWallet = () => {
    localStorage.removeItem("pv_key");
    setWallet(null);
  };

  const transferSol = async (to: string, sol: number, memo?: string) => {
    if (!wallet) {
      throw new Error("Wallet is not initialized");
    }

    const keyPair = Keypair.fromSecretKey(bs58.decode(wallet.privateKey));

    const transferTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keyPair.publicKey,
        toPubkey: new PublicKey(to),
        lamports: LAMPORTS_PER_SOL * sol,
      })
    );

    if (memo) {
      transferTransaction.add(
        new TransactionInstruction({
          keys: [
            { pubkey: new PublicKey(to), isSigner: true, isWritable: true },
          ],
          data: Buffer.from(memo, "utf-8"),
          programId: new PublicKey(
            "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          ),
        })
      );
    }

    await sendAndConfirmTransaction(connection, transferTransaction, [keyPair]);
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

      setBalance(balance / LAMPORTS_PER_SOL);
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
        transferSol,
      }}
    >
      {children}
    </SolWalletContext.Provider>
  );
};

export const useSolWallet = () => useContext(SolWalletContext);
