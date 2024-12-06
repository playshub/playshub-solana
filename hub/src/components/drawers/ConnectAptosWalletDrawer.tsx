import { useMutation, useQuery } from "@tanstack/react-query";

import { Button, Drawer, Flex, Image, Space, Typography } from "antd";
import { getQuestStatus } from "../../apis/quest/get-quest-status";
import { checkQuest } from "../../apis/quest/check-quest";
import { proceedQuest } from "../../apis/quest/proceed-quest";
import { useEffect, useState } from "react";
import { connectAptosWallet } from "../../apis/account/connect-wallet";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosWalletSelector } from "../modals/AptopsWalletSelect/AptopsWalletSelect";
import { useNotification } from "../providers/NotificationProvider";

export interface ConnectAptopsWalletDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function ConnectAptopsWalletDrawer({
  open,
  onClose,
}: ConnectAptopsWalletDrawerProps) {
  const { account, connected } = useWallet();
  const [walletSelectorModalOpen, setWalletSelectorModalOpen] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["get_quest_status"],
    queryFn: getQuestStatus,
  });
  const checkQuestMutation = useMutation({
    mutationFn: () => checkQuest("TASK", "CONNECT_APTOS_WALLET"),
  });
  const proceedQuestMutation = useMutation({
    mutationFn: () => proceedQuest("TASK", "CONNECT_APTOS_WALLET"),
  });
  const connectWalletMutation = useMutation({
    mutationFn: (address: string) => connectAptosWallet(address),
  });

  const task = data?.find(
    (item) => item.requestType === "CONNECT_APTOS_WALLET"
  );
  const earn = task?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0;

  const connect = async () => {
    await proceedQuestMutation.mutateAsync();
    if (connected) {
      notification.warning("You have completed the quest");
      return;
    }

    setWalletSelectorModalOpen(true);
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

  useEffect(() => {
    if (connected) {
      connectWalletMutation.mutate(account?.address!);
    }
  }, [connected, account]);

  return (
    <Drawer open={open} footer={null} placement="bottom" onClose={onClose}>
      <Flex vertical align="center" gap={15}>
        <Flex vertical align="center">
          <div style={{ padding: 10 }}>
            <Image
              src="/icons/earn/connect-aptos-wallet.png"
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
            Aptos Wallet
          </Typography.Text>
          <Typography.Text>Connect Aptos Wallet to get rewards</Typography.Text>
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
      <AptosWalletSelector
        isModalOpen={walletSelectorModalOpen}
        setModalOpen={setWalletSelectorModalOpen}
      />
    </Drawer>
  );
}
