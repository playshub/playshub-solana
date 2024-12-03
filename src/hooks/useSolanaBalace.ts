import { useConnection, useWallet } from "@ant-design/web3-solana";
import { useEffect, useState } from "react";

export function useSolanaBalance() {
  const [balanceData, setBalanceData] = useState<bigint>();

  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!(connection && publicKey)) {
      return;
    }

    const getBalance = async () => {
      const balanceVal = await connection.getBalance(publicKey);
      setBalanceData(BigInt(balanceVal));
    };

    getBalance();
  }, [connection, publicKey]);

  return balanceData;
}
