import { useSolWallet } from "@/components/providers/SolanaWalletProvider";
import { honeycombClient } from "@/core/honeycomb-client";
import { FindUsersQuery } from "@honeycomb-protocol/edge-client";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function useHoneycombUser() {
  const [user, setUser] = useState<null | FindUsersQuery["user"][0]>(null);
  const { wallet } = useSolWallet();

  useEffect(() => {
    (async () => {
      if (wallet?.publicKey) {
        const userPublicKey = new PublicKey(wallet?.publicKey).toString();
        const users = await honeycombClient.findUsers({
          wallets: [userPublicKey],
        });
        setUser(users.user[0]);
      }
    })();
  }, [wallet?.publicKey]);

  return user;
}
