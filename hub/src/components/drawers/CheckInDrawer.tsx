import { Button, Drawer, Flex, Image, Modal, Space, Typography } from "antd";
import { getQuestStatus } from "../../apis/quest/get-quest-status";
import { useMutation, useQuery } from "@tanstack/react-query";
import { checkQuest } from "../../apis/quest/check-quest";
import { proceedQuest } from "../../apis/quest/proceed-quest";
import { useEffect, useState } from "react";
import { getProfile } from "../../apis/account/profile";
import { useNotification } from "../providers/NotificationProvider";
import useSolCheckIn from "@/hooks/useSolCheckIn";
import { SOL_CHECKED_IN_AMOUNT } from "@/utils/constants";
import { useSolWallet } from "../providers/SolanaWalletProvider";
import { useRouter } from "next/navigation";

export interface CheckInDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckInDrawer({ open, onClose }: CheckInDrawerProps) {
  const { isInitialized } = useSolWallet();
  const notification = useNotification()!;
  const router = useRouter();
  const { data, refetch } = useQuery({
    queryKey: ["get_quest_status"],
    queryFn: getQuestStatus,
  });
  const { checkIn: solCheckIn, loading } = useSolCheckIn();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCreateWallet, setOpenCreateWallet] = useState(false);

  const checkQuestMutation = useMutation({
    mutationFn: () => checkQuest("DAILY", "CHECK_IN_TON_WALLET"),
  });
  const proceedQuestMutation = useMutation({
    mutationFn: () => proceedQuest("DAILY", "CHECK_IN_TON_WALLET"),
  });

  const task = data?.find((item) => item.requestType === "CHECK_IN_TON_WALLET");
  const earn = task?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0;

  const checkIn = async () => {
    await proceedQuestMutation.mutateAsync();
    if (!isInitialized) {
      setOpenCreateWallet(true);
      return;
    }
    setOpenConfirm(true);
  };

  useEffect(() => {
    if (checkQuestMutation.isSuccess) {
      notification.success(" Claim Bonus Successful!");
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
    if (!loading) {
      notification.success("Check-in successful. Please check to get reward");
    }
  }, [loading]);

  return (
    <Drawer open={open} footer={null} placement="bottom" onClose={onClose}>
      <Flex vertical align="center" gap={15}>
        <Flex vertical align="center">
          <div style={{ padding: 10 }}>
            <Image
              src="/icons/play/solana-icon.png"
              preview={false}
              width={80}
              alt=""
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
              alt=""
            />
          </Space>
        </Flex>
        <Flex vertical align="center">
          <Typography.Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Solana Wallet
          </Typography.Text>
          <Typography.Text>
            Check in your Solana Wallet to get bonus
          </Typography.Text>
        </Flex>
        <Flex vertical gap={10} style={{ width: "70%" }}>
          <Button
            type="primary"
            onClick={checkIn}
            style={{ padding: 20 }}
            loading={loading}
          >
            Check in
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
      <Modal
        onCancel={() => setOpenConfirm(false)}
        title="Confirm"
        open={openConfirm}
        onOk={() => {
          solCheckIn();
          setOpenConfirm(false);
        }}
      >
        <Flex align="center" vertical gap={10}>
          <Typography.Text>
            {`This will be sent ${SOL_CHECKED_IN_AMOUNT} SOL from your wallet`}
          </Typography.Text>
        </Flex>
      </Modal>

      <Modal
        onCancel={() => setOpenCreateWallet(false)}
        title="Confirm"
        open={openCreateWallet}
        onOk={() => {
          router.push("/wallet");
          setOpenCreateWallet(false);
        }}
      >
        <Flex align="center" vertical gap={10}>
          <Typography.Text>
            {`You haven't have the wallet yet, do you want to create one?`}
          </Typography.Text>
        </Flex>
      </Modal>
    </Drawer>
  );
}
