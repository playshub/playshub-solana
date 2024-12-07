"use client";
import { useSolWallet } from "@/components/providers/SolanaWalletProvider";
import WalletInitialize from "@/components/wallet/WalletInitialize";
import { formatAddress } from "@/utils/ton";
import {
  CopyOutlined,
  DeleteOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Flex,
  Image,
  Modal,
  Popconfirm,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Wallet() {
  const { isInitialized, wallet, deleteWallet, balance } = useSolWallet();
  const [open, setOpen] = useState(false);

  if (!isInitialized) {
    return <WalletInitialize />;
  }

  return (
    <div>
      <div style={{ padding: "10px 0px" }}>
        <Row gutter={[0, 10]}>
          <Col span={24}>
            <Flex vertical style={{ alignItems: "center" }}>
              <div style={{ padding: 10 }}>
                <Image
                  src={"/icons/play/solana-icon.png"}
                  preview={false}
                  width={80}
                  alt=""
                />
              </div>
              <Flex
                align="center"
                style={{
                  background: "#DBDBDB",
                  padding: "5px 40px",
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <Typography.Text style={{ flex: 1, fontWeight: "bold" }}>
                  {balance}{" "}
                  <Typography.Text style={{ color: "#8B4FF5" }}>
                    SOL
                  </Typography.Text>
                </Typography.Text>
              </Flex>
              <Flex
                align="center"
                style={{
                  background: "#DBDBDB",
                  padding: "5px 40px",
                  borderRadius: 10,
                }}
              >
                <Typography.Text style={{ flex: 1 }}>
                  {formatAddress(wallet?.publicKey!)}
                </Typography.Text>
                <CopyToClipboard text={wallet?.publicKey!}>
                  <Button icon={<CopyOutlined />} type="text"></Button>
                </CopyToClipboard>
              </Flex>
            </Flex>
          </Col>
          <Col span={24} style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Divider />
            <Typography.Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Privacy
            </Typography.Text>
          </Col>
          <Col span={24} style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Flex vertical gap={10}>
              <Button
                icon={<ExportOutlined />}
                size="large"
                type="primary"
                onClick={() => setOpen(true)}
              >
                Export Private Key
              </Button>
              <Popconfirm
                title="Delete Account"
                description="Are you sure to delete this account?"
                onConfirm={() => deleteWallet()}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="large"
                  style={{ background: "#F3816F", color: "white" }}
                >
                  Delete Account
                </Button>
              </Popconfirm>
            </Flex>
          </Col>
        </Row>
      </div>

      <Modal
        open={open}
        footer={null}
        closeIcon={null}
        onCancel={() => setOpen(false)}
      >
        <Flex vertical gap={10}>
          <div>{wallet?.privateKey}</div>
          <CopyToClipboard text={wallet?.privateKey!}>
            <Button
              icon={<CopyOutlined />}
              type="primary"
              onClick={() => setOpen(false)}
            >
              Copy
            </Button>
          </CopyToClipboard>
        </Flex>
      </Modal>
    </div>
  );
}
