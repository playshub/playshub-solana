import { Button, Drawer, Flex, Image, Space, Typography } from "antd";
import { getQuestStatus } from "../../apis/quest/get-quest-status";
import { useMutation, useQuery } from "@tanstack/react-query";
import { checkQuest } from "../../apis/quest/check-quest";
import { useEffect } from "react";
import { WALLET_PLAY_HUBS_URL } from "../../utils/constants";
import useTelegramUser from "@/hooks/useTelegramUser";
import { openLink } from "@telegram-apps/sdk-react";
import { useNotification } from "../providers/NotificationProvider";

export interface CheckInBnBDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckInBnBDrawer({
  open,
  onClose,
}: CheckInBnBDrawerProps) {
  const { data, refetch } = useQuery({
    queryKey: ["get_quest_status"],
    queryFn: getQuestStatus,
  });
  const notification = useNotification()!;
  const user = useTelegramUser();

  const task = data?.find((item) => item.requestType === "CHECK_IN_BNB_WALLET");
  const earn = task?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0;

  const checkQuestMutation = useMutation({
    mutationFn: () => checkQuest("DAILY", "CHECK_IN_BNB_WALLET"),
  });

  const checkIn = async () => {
    openLink(
      `${WALLET_PLAY_HUBS_URL}?telegram_id=${user?.id?.toString()}&first_name=${
        user?.firstName
      }&last_name=${user?.lastName}&language_code=${user?.languageCode || "en"}`
    );
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
              src="/icons/earn/check-in-bnb.png"
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
            BNB Wallet
          </Typography.Text>
          <Typography.Text>
            Check in your BNB Wallet to get bonus
          </Typography.Text>
        </Flex>
        <Flex vertical gap={10} style={{ width: "70%" }}>
          <Button type="primary" onClick={checkIn} style={{ padding: 20 }}>
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
    </Drawer>
  );
}
