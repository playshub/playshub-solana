import { Button, Drawer, Flex, Image, Space, Typography } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQuestStatus } from "../../apis/quest/get-quest-status";
import { checkQuest } from "../../apis/quest/check-quest";
import { proceedQuest } from "../../apis/quest/proceed-quest";
import { useNotification } from "../providers/NotificationProvider";
import { useEffect } from "react";

import { openTelegramLink } from "@telegram-apps/sdk-react";

export interface JoinPlayChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function JoinPlayChatDrawer({
  open,
  onClose,
}: JoinPlayChatDrawerProps) {
  const { data, refetch } = useQuery({
    queryKey: ["get_quest_status"],
    queryFn: getQuestStatus,
  });
  const checkQuestMutation = useMutation({
    mutationFn: () => checkQuest("TASK", "JOIN_PLAYS_CHAT"),
  });
  const proceedQuestMutation = useMutation({
    mutationFn: () => proceedQuest("TASK", "JOIN_PLAYS_CHAT"),
  });

  const task = data?.find((item) => item.requestType === "JOIN_PLAYS_CHAT");
  const earn = task?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0;

  const join = async () => {
    await proceedQuestMutation.mutateAsync();
    if (task?.additional) {
      openTelegramLink(task.additional);
    }
  };

  const notification = useNotification()!;
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
              src="/icons/earn/join-play-chat.png"
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
            PLAYS Chat
          </Typography.Text>
          <Typography.Text>Join PLAYS Chat to get rewards</Typography.Text>
        </Flex>
        <Flex vertical gap={10} style={{ width: "70%" }}>
          <Button type="primary" onClick={join} style={{ padding: 20 }}>
            Join
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
