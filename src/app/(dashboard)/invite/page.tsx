"use client";

import { CopyOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Col,
  Empty,
  Flex,
  Image,
  List,
  notification,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { getProfile } from "../../../apis/account/profile";
import { getFriends } from "../../../apis/account/friends";
import { getInviteRewardConfig } from "../../../apis/invite/reward-config";
import { openTelegramLink } from "@telegram-apps/sdk-react";

export default function Invite() {
  const { data: friendData, isLoading } = useQuery({
    queryKey: ["get_friends"],
    queryFn: getFriends,
  });

  const friends =
    friendData?.map((item) => ({
      name: item.displayName,
      avatar: `/icons/rank/avatar/${Math.floor(Math.random() * 8) + 1}.png`,
      plays: item.plays,
    })) || [];

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { data: inviteRewardConfigData } = useQuery({
    queryKey: ["invite_reward_config"],
    queryFn: getInviteRewardConfig,
  });

  const invite = async () => {
    openTelegramLink(
      `https://t.me/share/url?url=https://t.me/playshubbot/hub?startapp=ref_${profileData?.account?.accountId}`
    );
  };

  const parseInviteRewardConfig = (
    reward: `PLAYS: ${string}, TON: ${string}`
  ) => {
    const match = reward?.match(/PLAYS:\s*(\d+),\s*TON:\s*([\d.]+)/);
    return {
      plays: match?.[1],
      ton: match?.[2],
    };
  };

  const normalInviteReward = parseInviteRewardConfig(
    inviteRewardConfigData?.normalInvite
  );

  // const premiumInviteReward = parseInviteRewardConfig(
  //   inviteRewardConfigData?.premiumInvite
  // );

  return (
    <div>
      <div style={{ padding: "10px 0px" }}>
        <Row gutter={[0, 10]}>
          <Col span={24}>
            <Flex vertical style={{ alignItems: "center" }}>
              <div style={{ padding: 10 }}>
                <Image
                  src="/icons/invite/invite-icon.png"
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
                  Invite friends
                </Typography.Text>
              </div>
              <div
                style={{
                  width: "65%",
                  marginLeft: "auto",
                  marginRight: " auto",
                  textAlign: "center",
                }}
              >
                <Typography.Text>
                  You and your friend receive bonuses for invitation
                </Typography.Text>
              </div>
            </Flex>
          </Col>
        </Row>
      </div>
      <Spin spinning={isLoading}>
        <div
          style={{
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Flex vertical gap={10}>
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: "Invite a friend",
                  earnPlay: normalInviteReward.plays,
                  earnTon: normalInviteReward.ton,
                  avatar: "/icons/invite/invite.png",
                },
                // {
                //   title: "Invite a Telegram Premium friend",
                //   earnPlay: premiumInviteReward.plays,
                //   earnTon: premiumInviteReward.ton,
                //   avatar: "/icons/invite/invite-premium.png",
                // },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Image preview={false} src={item.avatar} width={50} />
                    }
                    title={item.title}
                    description={
                      <Flex gap={20}>
                        <Space>
                          <Image
                            src="/icons/play/$plays-coin.png"
                            width={22}
                            preview={false}
                          />
                          <Typography.Text style={{ color: "#01BEED" }}>{`+${
                            item.earnPlay || 0
                          }`}</Typography.Text>
                        </Space>
                        <Space>
                          <Image
                            src="/icons/play/ton-icon.png"
                            width={22}
                            preview={false}
                          />
                          <Typography.Text style={{ color: "#01BEED" }}>{`+${
                            item.earnTon || 0
                          }`}</Typography.Text>
                        </Space>
                      </Flex>
                    }
                  />
                </List.Item>
              )}
            />
            <div>
              <Flex gap={5}>
                <Button type="primary" style={{ flexGrow: 1 }} onClick={invite}>
                  Invite Friend
                </Button>
                <CopyToClipboard
                  text={`https://t.me/playshubbot/hub?startapp=ref_${profileData?.account?.accountId}`}
                  onCopy={() => {
                    notification.info({
                      message: "Invite link copied to clipboard",
                      placement: "bottom",
                      closeIcon: null,
                      icon: <CopyOutlined />,
                      duration: 1,
                    });
                  }}
                >
                  <Button icon={<CopyOutlined />} onClick={() => {}}></Button>
                </CopyToClipboard>
              </Flex>
            </div>
          </Flex>
        </div>
      </Spin>

      <div
        style={{
          background: "white",
          padding: "10px",
          marginTop: 10,
          borderRadius: 10,
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={friends}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} size={40} />}
                title={item.name}
              />
              <div>
                <Space>
                  <Typography.Text
                    style={{ color: "#01BEED" }}
                  >{`+${item.plays}`}</Typography.Text>
                  <Image
                    src="/icons/play/$plays-coin.png"
                    width={22}
                    preview={false}
                  />
                </Space>
              </div>
            </List.Item>
          )}
        >
          {friends.length === 0 && <Empty description="No Friends" />}
        </List>
      </div>
    </div>
  );
}
