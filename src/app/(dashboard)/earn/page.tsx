"use client";
import {
  Avatar,
  Button,
  Col,
  Flex,
  Image,
  List,
  Progress,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import CheckInDrawer from "../../../components/drawers/CheckInDrawer";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQuestStatus } from "../../../apis/quest/get-quest-status";
import Loading from "../../../components/spin/Loading";
import ConnectWalletDrawer from "../../../components/drawers/ConnectWalletDrawer";
import PlayCatBDrawer from "../../../components/drawers/PlayCatBDrawer";
import InviteFriendDrawer from "../../../components/drawers/InviteFriendDrawer";
import VisitPlaysCommunityDrawer from "../../../components/drawers/VisitPlaysCommunityDrawer";
import JoinPlayChannelDrawer from "../../../components/drawers/JoinPlayChannelDrawer";
import JoinPlayChatDrawer from "../../../components/drawers/JoinPlayChatDrawer";
import FollowXDrawer from "../../../components/drawers/FollowXDrawer";
import { checkQuest } from "../../../apis/quest/check-quest";
import PlayCatLuckyDrawer from "../../../components/drawers/PlayCatLuckyDrawer";
import CheckInBnBDrawer from "../../../components/drawers/CheckInBnBDrawer";
import ConnectAptosWalletDrawer from "../../../components/drawers/ConnectAptosWalletDrawer";
import { useNotification } from "@/components/providers/NotificationProvider";

export default function Earn() {
  const notification = useNotification()!;
  const [openCheckInBnBDrawer, setOpenCheckInBnBOpenDrawer] = useState(false);
  const [openCheckInDrawer, setOpenCheckInOpenDrawer] = useState(false);
  const [openPlayCatBDrawer, setOpenPlayCatBDrawer] = useState(false);
  const [openInviteFriendDrawer, setOpenInviteFriendDrawer] = useState(false);
  const [openVisitPlaysCommunityDrawer, setOpenVisitPlaysCommunityDrawer] =
    useState(false);
  const [openPlayCatLuckyDrawer, setOpenPlayCatLuckyDrawer] = useState(false);
  const [openConnectTonDrawer, setOpenConnectTonOpenDrawer] = useState(false);
  const [openJoinPlaysChannelDrawer, setOpenJoinPlaysChannelDrawer] =
    useState(false);
  const [openJoinPlaysChatDrawer, setOpenJoinPlaysChatDrawer] = useState(false);
  const [openFollowXDrawer, setOpenFollowXDrawer] = useState(false);
  const [openConnectAptosDrawer, setOpenConnectAptosOpenDrawer] =
    useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["get_quest_status"],
    queryFn: getQuestStatus,
  });
  const checkQuestCompleteDailyMutation = useMutation({
    mutationFn: () => checkQuest("DAILY", "COMPLETE_DAILY_TASK"),
  });

  const checkInTonWalletDailyTask = data?.find(
    (item) => item.requestType === "CHECK_IN_TON_WALLET"
  );
  const playCatBattleDailyTask = data?.find(
    (item) => item.requestType === "PLAY_CAT_BATTLE"
  );
  const inviteDailyTask = data?.find((item) => item.requestType === "INVITE");
  const visitPlaysCommunityDailyTask = data?.find(
    (item) => item.requestType === "VISIT_PLAYS_COMMUNITY"
  );
  const playCatLuckyDailyTask = data?.find(
    (item) => item.requestType === "PLAY_CAT_LUCKY"
  );
  const completeDailyTask = data?.find(
    (item) => item.requestType === "COMPLETE_DAILY_TASK"
  );
  const checkInBnBWalletDailyTask = data?.find(
    (item) => item.requestType === "CHECK_IN_BNB_WALLET"
  );

  const dailyTasks = [
    {
      name: "Check-in Solana Wallet",
      image: "/icons/play/solana-icon.png",
      earn: checkInTonWalletDailyTask?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0,
      done: checkInTonWalletDailyTask?.rewardedStep === 1,
      onclick: () => setOpenCheckInOpenDrawer(true),
    },
    {
      name: "Play Cat Battle 1 time",
      image: "/icons/earn/play.png",
      earn: playCatBattleDailyTask?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0,
      done: playCatBattleDailyTask?.rewardedStep === 1,
      onclick: () => {
        setOpenPlayCatBDrawer(true);
      },
    },
    {
      name: "Invite 1 friend",
      image: "/icons/earn/invite.png",
      earn: inviteDailyTask?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0,
      done: inviteDailyTask?.rewardedStep === 1,
      onclick: () => {
        setOpenInviteFriendDrawer(true);
      },
    },
    {
      name: "Visit PLAYS Community",
      image: "/icons/earn/visit-community.png",
      earn:
        visitPlaysCommunityDailyTask?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0,
      done: visitPlaysCommunityDailyTask?.rewardedStep === 1,
      onclick: () => {
        setOpenVisitPlaysCommunityDrawer(true);
      },
    },
    {
      name: "Play Cat Lucky",
      image: "/icons/earn/play-cat-lucky.png",
      earn: playCatLuckyDailyTask?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0,
      done: playCatLuckyDailyTask?.rewardedStep === 1,
      onclick: () => {
        setOpenPlayCatLuckyDrawer(true);
      },
    },
  ];

  const connectTonWalletTask = data?.find(
    (item) => item.requestType === "CONNECT_TON_WALLET"
  );
  const joinPlaysChannelTask = data?.find(
    (item) => item.requestType === "JOIN_PLAYS_CHANNEL"
  );
  const joinPlaysChatTask = data?.find(
    (item) => item.requestType === "JOIN_PLAYS_CHAT"
  );
  const followPlaysOnXTask = data?.find(
    (item) => item.requestType === "FOLLOW_PLAYS_ON_X"
  );
  const connectAptosWalletTask = data?.find(
    (item) => item.requestType === "CONNECT_APTOS_WALLET"
  );

  const tasks = [
    {
      name: "Connect Solana Wallet",
      image: "/icons/earn/connect-ton-wallet.png",
      earn: connectTonWalletTask?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0,
      done: connectTonWalletTask?.rewardedStep === 1,
      onclick: () => {
        setOpenConnectTonOpenDrawer(true);
      },
    },
    {
      name: "Join PLAYS channel",
      image: "/icons/earn/join-play-channel.png",
      earn: joinPlaysChannelTask?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0,
      done: joinPlaysChannelTask?.rewardedStep === 1,
      onclick: () => {
        setOpenJoinPlaysChannelDrawer(true);
      },
    },
    {
      name: "Join PLAYS Chat",
      image: "/icons/earn/join-play-chat.png",
      earn: joinPlaysChatTask?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0,
      done: joinPlaysChatTask?.rewardedStep === 1,
      onclick: () => {
        setOpenJoinPlaysChatDrawer(true);
      },
    },
    {
      name: "Follow PLAYS on X",
      image: "/icons/earn/follow-play.png",
      earn: followPlaysOnXTask?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0,
      done: followPlaysOnXTask?.rewardedStep === 1,
      onclick: () => {
        setOpenFollowXDrawer(true);
      },
    },
  ];

  const isDailyTaskDone =
    completeDailyTask?.progressAmount === completeDailyTask?.requestAmount;
  const isDailyTaskClaimed = completeDailyTask?.rewardedStep === 1;

  useEffect(() => {
    if (checkQuestCompleteDailyMutation.isSuccess) {
      notification.success(" Claim Bonus Successful!");
    }
  }, [checkQuestCompleteDailyMutation.isSuccess]);

  return (
    <Spin spinning={isLoading}>
      <div>
        <div style={{ padding: "10px 0px" }}>
          <Row gutter={[0, 10]}>
            <Col span={24}>
              <Flex vertical style={{ alignItems: "center" }}>
                <div style={{ padding: 10 }}>
                  <Image
                    src="/icons/earn/earn-icon.png"
                    preview={false}
                    width={80}
                  />
                </div>
                <div>
                  <Typography.Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      fontFamily: "myriadpro-bold",
                    }}
                  >
                    Earn $PLAYS
                  </Typography.Text>
                </div>
              </Flex>
            </Col>
          </Row>
        </div>

        <div>
          <div>
            <Flex align="center" gap={10} style={{ marginBottom: 5 }}>
              <Typography.Text
                style={{ color: "#767676", fontWeight: "bold" }}
              >{`DAILY TASKS (${completeDailyTask?.progressAmount}/${completeDailyTask?.requestAmount})`}</Typography.Text>
              <Space>
                <Image
                  src="/icons/play/$plays-coin.png"
                  width={20}
                  preview={false}
                />
                <Typography.Text style={{ color: "#01BEED" }}>{`+${
                  completeDailyTask?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0
                }`}</Typography.Text>
              </Space>
              <Button
                style={{ marginLeft: "auto" }}
                type={
                  !isDailyTaskDone || isDailyTaskClaimed ? "default" : "primary"
                }
                onClick={async () => {
                  checkQuestCompleteDailyMutation.mutate();
                }}
                disabled={!isDailyTaskDone || isDailyTaskClaimed}
              >
                Claim
              </Button>
            </Flex>
            <Progress
              percent={
                ((completeDailyTask?.progressAmount || 0) /
                  (completeDailyTask?.requestAmount || 1)) *
                100
              }
              showInfo={false}
            />
          </div>
          <div
            style={{ background: "white", padding: "10px", borderRadius: 10 }}
          >
            <List
              itemLayout="horizontal"
              dataSource={dailyTasks}
              renderItem={(item) => (
                <List.Item style={{ cursor: "pointer" }} onClick={item.onclick}>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={item.image} shape="square" size={70} />
                    }
                    title={item.name}
                    description={
                      <Space>
                        <Image
                          src="/icons/play/$plays-coin.png"
                          width={20}
                          preview={false}
                        />
                        <Typography.Text
                          style={{ color: "#01BEED" }}
                        >{`+${item.earn}`}</Typography.Text>
                      </Space>
                    }
                  />
                  <div style={{ marginRight: 15 }}>
                    {item.done && (
                      <Image
                        src="/icons/earn/done-stick.png"
                        width={30}
                        preview={false}
                      />
                    )}
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <div>
            <Flex align="center" gap={10} style={{ marginBottom: 5 }}>
              <Typography.Text style={{ color: "#767676", fontWeight: "bold" }}>
                TASKS
              </Typography.Text>
            </Flex>
          </div>
          <div
            style={{ background: "white", padding: "10px", borderRadius: 10 }}
          >
            <List
              itemLayout="horizontal"
              dataSource={tasks}
              renderItem={(item) => (
                <List.Item style={{ cursor: "pointer" }} onClick={item.onclick}>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={item.image} shape="square" size={70} />
                    }
                    title={item.name}
                    description={
                      <Space>
                        <Image
                          src="/icons/play/$plays-coin.png"
                          width={20}
                          preview={false}
                        />
                        <Typography.Text
                          style={{ color: "#01BEED" }}
                        >{`+${item.earn}`}</Typography.Text>
                      </Space>
                    }
                  />
                  <div style={{ marginRight: 15 }}>
                    {item.done && (
                      <Image
                        src="/icons/earn/done-stick.png"
                        width={30}
                        preview={false}
                      />
                    )}
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>

        <CheckInBnBDrawer
          open={openCheckInBnBDrawer}
          onClose={() => {
            setOpenCheckInBnBOpenDrawer(false);
          }}
        />
        <CheckInDrawer
          open={openCheckInDrawer}
          onClose={() => {
            setOpenCheckInOpenDrawer(false);
          }}
        />
        <PlayCatBDrawer
          open={openPlayCatBDrawer}
          onClose={() => {
            setOpenPlayCatBDrawer(false);
          }}
        />
        <InviteFriendDrawer
          open={openInviteFriendDrawer}
          onClose={() => {
            setOpenInviteFriendDrawer(false);
          }}
        />
        <VisitPlaysCommunityDrawer
          open={openVisitPlaysCommunityDrawer}
          onClose={() => {
            setOpenVisitPlaysCommunityDrawer(false);
          }}
        />
        <PlayCatLuckyDrawer
          open={openPlayCatLuckyDrawer}
          onClose={() => {
            setOpenPlayCatLuckyDrawer(false);
          }}
        />
        <ConnectWalletDrawer
          open={openConnectTonDrawer}
          onClose={() => {
            setOpenConnectTonOpenDrawer(false);
          }}
        />
        <ConnectAptosWalletDrawer
          open={openConnectAptosDrawer}
          onClose={() => {
            setOpenConnectAptosOpenDrawer(false);
          }}
        />
        <JoinPlayChannelDrawer
          open={openJoinPlaysChannelDrawer}
          onClose={() => {
            setOpenJoinPlaysChannelDrawer(false);
          }}
        />
        <JoinPlayChatDrawer
          open={openJoinPlaysChatDrawer}
          onClose={() => {
            setOpenJoinPlaysChatDrawer(false);
          }}
        />
        <FollowXDrawer
          open={openFollowXDrawer}
          onClose={() => {
            setOpenFollowXDrawer(false);
          }}
        />
      </div>
    </Spin>
  );
}
