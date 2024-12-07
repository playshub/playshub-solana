import { CopyOutlined, ImportOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Flex,
  Input,
  Modal,
  Row,
  Typography,
  Image,
} from "antd";
import { useSolWallet } from "../providers/SolanaWalletProvider";
import { useState } from "react";
import { useNotification } from "../providers/NotificationProvider";

export default function WalletInitialize() {
  const { generateWallet, importWallet } = useSolWallet();
  const [open, setOpen] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const notification = useNotification()!;

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
                  0{" "}
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
                  Your SOL wallet address
                </Typography.Text>
              </Flex>
            </Flex>
          </Col>
          <Col span={24} style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Divider />
            <Typography.Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Wallet Action
            </Typography.Text>
          </Col>
          <Col span={24} style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Flex vertical gap={10}>
              <Button
                icon={<ImportOutlined />}
                size="large"
                onClick={() => setOpen(true)}
                type="primary"
              >
                Import Wallet
              </Button>
              <Button
                icon={<PlusOutlined />}
                size="large"
                onClick={() => generateWallet()}
                type="primary"
              >
                Create New Wallet
              </Button>
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
          <div>
            <Input.TextArea
              style={{ height: 100 }}
              placeholder="Please input your private key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            ></Input.TextArea>
          </div>
          <Button
            icon={<ImportOutlined />}
            type="primary"
            onClick={() => {
              try {
                importWallet(privateKey);
              } catch (error) {
                notification.error("Invalid private key");
                console.error(error);
              }
            }}
            disabled={!privateKey}
          >
            Import
          </Button>
        </Flex>
      </Modal>
    </div>
  );
}
