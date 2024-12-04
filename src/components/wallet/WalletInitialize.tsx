import { CopyOutlined, ImportOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Modal } from "antd";
import { useSolWallet } from "../providers/SolanaWalletProvider";
import { useState } from "react";
import { useNotification } from "../providers/NotificationProvider";

export default function WalletInitialize() {
  const { generateWallet, importWallet } = useSolWallet();
  const [open, setOpen] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const notification = useNotification()!;

  return (
    <Flex vertical style={{ height: "calc(100vh - 88px)" }}>
      <div style={{ flex: 1 }}></div>
      <Flex vertical gap={10}>
        <Button
          icon={<ImportOutlined />}
          size="large"
          onClick={() => setOpen(true)}
        >
          Import Wallet
        </Button>
        <Button
          icon={<PlusOutlined />}
          size="large"
          onClick={() => generateWallet()}
        >
          Create New Wallet
        </Button>
      </Flex>

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
              }
            }}
            disabled={!privateKey}
          >
            Import
          </Button>
        </Flex>
      </Modal>
    </Flex>
  );
}
