import { useMutation, useQuery } from "@tanstack/react-query";

import { Button, Drawer, Flex, Image, Space, Typography } from "antd";
import { getQuestStatus } from "../../apis/quest/get-quest-status";
import { checkQuest } from "../../apis/quest/check-quest";
import { proceedQuest } from "../../apis/quest/proceed-quest";
import { useEffect } from "react";
import { useNotification } from "../providers/NotificationProvider";
import { connectTonWallet } from "../../apis/account/connect-wallet";
import { useRouter } from "next/navigation";
import { useSolWallet } from "../providers/SolanaWalletProvider";

export interface ConnectWalletDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function ConnectWalletDrawer({
  open,
  onClose,
}: ConnectWalletDrawerProps) {
  const router = useRouter();
  const { isInitialized } = useSolWallet();

  const { data, refetch } = useQuery({
    queryKey: ["get_quest_status"],
    queryFn: getQuestStatus,
  });
  const checkQuestMutation = useMutation({
    mutationFn: () => checkQuest("TASK", "CONNECT_TON_WALLET"),
  });
  const proceedQuestMutation = useMutation({
    mutationFn: () => proceedQuest("TASK", "CONNECT_TON_WALLET"),
  });

  const task = data?.find((item) => item.requestType === "CONNECT_TON_WALLET");
  const earn = task?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0;

  const connect = async () => {
    await proceedQuestMutation.mutateAsync();
    if (isInitialized) {
      notification.info("You have connected the wallet");
      return;
    }

    router.push("/wallet");
    onClose();
    return;
  };

  const notification = useNotification()!;
  useEffect(() => {
    if (checkQuestMutation.isSuccess) {
      notification.success("Claim Bonus Successful!");
      refetch();
      onClose();
    }
  }, [checkQuestMutation.isSuccess]);

  useEffect(() => {
    if (checkQuestMutation.isError) {
      if (checkQuestMutation.error.message === "You have claimed the quest") {
        notification.warning("You have claimed the quest");
      } else {
        notification.warning("You have not completed the quest");
      }
    }
  }, [checkQuestMutation.isError]);

  return (
    <Drawer open={open} footer={null} placement="bottom" onClose={onClose}>
      <Flex vertical align="center" gap={15}>
        <Flex vertical align="center">
          <div style={{ padding: 10 }}>
            <Image
              src="/icons/earn/connect-ton-wallet.png"
              preview={false}
              width={80}
            />
          </div>
          <Space>
            <Typography.Text style={{ color: "#01BEED" }}>
              {`+${earn}`}
            </Typography.Text>
            <Image
              src="/icons/play/$plays-coin.png"
              width={20}
              preview={false}
            />
          </Space>
        </Flex>
        <Flex vertical align="center">
          <Typography.Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Solana Wallet
          </Typography.Text>
          <Typography.Text>
            Connect Solana Wallet to get rewards
          </Typography.Text>
        </Flex>
        <Flex vertical gap={10} style={{ width: "70%" }}>
          <Button type="primary" onClick={connect} style={{ padding: 20 }}>
            Connect
          </Button>
          <Button
            type="default"
            style={{ padding: 20 }}
            onClick={() => checkQuestMutation.mutate()}
          >
            Check
          </Button>
        </Flex>
      </Flex>
    </Drawer>
  );
}
