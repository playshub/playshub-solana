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

export interface CheckInDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckInDrawer({ open, onClose }: CheckInDrawerProps) {
  const notification = useNotification()!;
  const { data, refetch } = useQuery({
    queryKey: ["get_quest_status"],
    queryFn: getQuestStatus,
  });
  const { checkIn: solCheckIn, loading } = useSolCheckIn();
  const [openConfirm, setOpenConfirm] = useState(false);

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
    </Drawer>
  );
}
