import { Button, Drawer, Flex, Image, Space, Typography } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQuestStatus } from "../../apis/quest/get-quest-status";
import { checkQuest } from "../../apis/quest/check-quest";
import { proceedQuest } from "../../apis/quest/proceed-quest";
import { useNotification } from "../providers/NotificationProvider";
import { useEffect } from "react";

import { GAME_CAT_LUCKY_URL } from "../../utils/constants";
import useTelegramUser from "@/hooks/useTelegramUser";

export interface PlayCatLuckyDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function PlayCatLuckyDrawer({
  open,
  onClose,
}: PlayCatLuckyDrawerProps) {
  const user = useTelegramUser();
  const { data, refetch } = useQuery({
    queryKey: ["get_quest_status"],
    queryFn: getQuestStatus,
  });
  const checkQuestMutation = useMutation({
    mutationFn: () => checkQuest("DAILY", "PLAY_CAT_LUCKY"),
  });
  const proceedQuestMutation = useMutation({
    mutationFn: () => proceedQuest("DAILY", "PLAY_CAT_LUCKY"),
  });
  const task = data?.find((item) => item.requestType === "PLAY_CAT_LUCKY");
  const earn = task?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0;

  const play = async () => {
    await proceedQuestMutation.mutateAsync();
    const link = `${GAME_CAT_LUCKY_URL}/?tgWebAppStartParam#tgWebAppData&user={id:${user?.id},first_name:${user?.firstName},last_name:${user?.lastName}}`;
    window.open(link, "_self");
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
              src="/icons/earn/play-cat-lucky.png"
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
            PLAYS Hub
          </Typography.Text>
          <Typography.Text>Play Cat Lucky game to get bonus</Typography.Text>
        </Flex>
        <Flex vertical gap={10} style={{ width: "70%" }}>
          <Button type="primary" onClick={play} style={{ padding: 20 }}>
            Play
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
