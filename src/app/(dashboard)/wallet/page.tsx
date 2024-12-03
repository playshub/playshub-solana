"use client";
import { DisconnectOutlined } from "@ant-design/icons";
import {
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import {
  Avatar,
  Button,
  Col,
  Flex,
  Image,
  List,
  Row,
  Space,
  Typography,
} from "antd";
import { formatAddress } from "../../../utils/ton";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { getProfile } from "../../../apis/account/profile";
import { useQuery } from "@tanstack/react-query";

enum WalletType {
  TON = "TON",
  BNB = "BNB",
  PLAYS = "PLAYS",
}

export default function Wallet() {
  const { open } = useTonConnectModal();
  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const wallets = [
    {
      name: "PLAYS",
      image: "/icons/play/$plays-coin.png",
      usdPrice: data?.currency?.plays || 0,
      actions: [],
    },
    {
      name: "TON",
      image: "/icons/play/ton-icon.png",
      usdPrice: data?.currency?.ton || 0,
      actions: [
        tonConnectUI.connected ? (
          <Space>
            <Typography.Text>
              {formatAddress(userFriendlyAddress)}
            </Typography.Text>
            <Button
              onClick={async () => {
                await tonConnectUI.disconnect();
              }}
              icon={<DisconnectOutlined />}
            ></Button>
          </Space>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              open();
            }}
          >
            Connect
          </Button>
        ),
      ],
    },
  ];

  const selectedWallet = tonConnectUI.connected
    ? WalletType.TON
    : isConnected
    ? WalletType.BNB
    : WalletType.PLAYS;

  return (
    <div>
      <div style={{ padding: "10px 0px" }}>
        <Row gutter={[0, 10]}>
          <Col span={24}>
            <Flex vertical style={{ alignItems: "center" }}>
              <div style={{ padding: 10 }}>
                <Image
                  src={
                    selectedWallet === WalletType.PLAYS
                      ? "/icons/play/$plays-coin.png"
                      : selectedWallet === WalletType.TON
                      ? "/icons/play/ton-icon.png"
                      : "/icons/play/bnb-icon.png"
                  }
                  preview={false}
                  width={80}
                />
              </div>
              <div
                style={{
                  background: "#DBDBDB",
                  padding: "5px 40px",
                  borderRadius: 10,
                }}
              >
                <Typography.Text style={{ fontWeight: "bold" }}>
                  {selectedWallet === WalletType.PLAYS
                    ? data?.currency?.plays
                    : selectedWallet === WalletType.TON
                    ? data?.currency?.ton
                    : data?.currency?.bnb}{" "}
                  <Typography.Text style={{ color: "#01BEED" }}>
                    {selectedWallet === WalletType.PLAYS
                      ? "$PLAYS"
                      : selectedWallet === WalletType.TON
                      ? "TON"
                      : "BNB"}
                  </Typography.Text>
                </Typography.Text>
              </div>
            </Flex>
          </Col>

          <Col span={24}>
            <Flex vertical align="center">
              <Space>
                <Button style={{ width: "100%" }} disabled>
                  Deposit
                </Button>
                <Button style={{ width: "100%" }} disabled>
                  Withdraw
                </Button>
              </Space>
            </Flex>
          </Col>
        </Row>
      </div>
      <div
        style={{
          background: "white",
          padding: "10px",
          borderRadius: 10,
          marginTop: 40,
        }}
      >
        <List
          header={
            <Typography.Text style={{ fontWeight: "bold" }}>
              Select tokens:
            </Typography.Text>
          }
          itemLayout="horizontal"
          dataSource={wallets}
          renderItem={(item) => (
            <List.Item actions={item.actions}>
              <List.Item.Meta
                avatar={<Avatar src={item.image} size={50} />}
                title={item.name}
                description={item.usdPrice}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
