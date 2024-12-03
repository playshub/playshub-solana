"use client";
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
import { getProfile } from "../../../apis/account/profile";
import { useQuery } from "@tanstack/react-query";
import { ConnectButton, Connector } from "@ant-design/web3";
import { useWallet } from "@ant-design/web3-solana";
import { useSolanaBalance } from "@/hooks/useSolanaBalace";

enum WalletType {
  TON = "TON",
  BNB = "BNB",
  PLAYS = "PLAYS",
  SOLANA = "SOLANA",
}

export default function Wallet() {
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  const balance = useSolanaBalance();

  const { publicKey } = useWallet();

  const wallets = [
    {
      name: "PLAYS",
      image: "/icons/play/$plays-coin.png",
      usdPrice: data?.currency?.plays || 0,
      actions: [],
    },
    {
      name: "Solana",
      image: "/icons/play/solana-icon.png",
      usdPrice: 0,
      actions: [
        <Connector modalProps={{ mode: "simple", group: false }} key="solana">
          <ConnectButton quickConnect />
        </Connector>,
      ],
    },
  ];

  const selectedWallet = publicKey ? WalletType.SOLANA : WalletType.PLAYS;

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
                      : "/icons/play/solana-icon.png"
                  }
                  preview={false}
                  width={80}
                  alt=""
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
                    : balance?.toString()}{" "}
                  <Typography.Text style={{ color: "#01BEED" }}>
                    {selectedWallet === WalletType.PLAYS ? "$PLAYS" : "SOL"}
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
