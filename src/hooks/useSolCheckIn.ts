import { useSolWallet } from "@/components/providers/SolanaWalletProvider";
import {
  SOL_CHECKED_IN_ADDRESS,
  SOL_CHECKED_IN_AMOUNT,
} from "@/utils/constants";
import useTelegramUser from "./useTelegramUser";
import { useState } from "react";

export default function useSolCheckIn() {
  const { transferSol } = useSolWallet();
  const user = useTelegramUser();
  const [loading, setLoading] = useState(false);

  const checkIn = async () => {
    try {
      setLoading(true);
      await transferSol(
        SOL_CHECKED_IN_ADDRESS,
        parseFloat(SOL_CHECKED_IN_AMOUNT),
        JSON.stringify({ type: "Check In", userId: user?.id })
      );
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      throw error;
    }
  };

  return { checkIn, loading };
}
