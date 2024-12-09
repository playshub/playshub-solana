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

export interface SolUnitySdkConfig {
  privateKey: string;
  purchaseItemAddress: string;

  rpcUrl?: string;
}
export default class SolUnitySdk {
  private keyPair: Keypair;
  private connection: Connection;
  private config: SolUnitySdkConfig;

  constructor(config: SolUnitySdkConfig) {
    const keyPair = Keypair.fromSecretKey(bs58.decode(config.privateKey));
    const connection = new Connection(
      config.rpcUrl || "https://api.devnet.solana.com",
      "confirmed"
    );

    this.keyPair = keyPair;
    this.connection = connection;
    this.config = config;
  }

  purchaseItem = async (userId: string, itemId: string, amount: string) => {
    console.log("Purchasing...");
    await this.transferSol(
      this.config.purchaseItemAddress,
      parseFloat(amount),
      JSON.stringify({
        type: "Purchase Item",
        userId,
        itemId,
      })
    );
    console.log("Confirming...");
    await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log("Purchased!");
  };

  getPublicKey = () => this.keyPair.publicKey.toBase58();

  getBalance = async () => {
    const balance = await this.connection.getBalance(this.keyPair.publicKey);
    return balance / LAMPORTS_PER_SOL;
  };

  private transferSol = async (to: string, sol: number, memo?: string) => {
    const transferTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: this.keyPair.publicKey,
        toPubkey: new PublicKey(to),
        lamports: LAMPORTS_PER_SOL * sol,
      })
    );

    if (memo) {
      transferTransaction.add(
        new TransactionInstruction({
          keys: [
            {
              pubkey: this.keyPair.publicKey,
              isSigner: true,
              isWritable: true,
            },
          ],
          data: Buffer.from(memo, "utf-8"),
          programId: new PublicKey(
            "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          ),
        })
      );
    }

    await sendAndConfirmTransaction(this.connection, transferTransaction, [
      this.keyPair,
    ]);
  };
}
