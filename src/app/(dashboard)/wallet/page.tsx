"use client";
import { Avatar, Button, Col, Flex, Image, Row, Space, Typography } from "antd";

enum WalletType {
  TON = "TON",
  BNB = "BNB",
  PLAYS = "PLAYS",
  SOLANA = "SOLANA",
}

export default function Wallet() {
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
              <div
                style={{
                  background: "#DBDBDB",
                  padding: "5px 40px",
                  borderRadius: 10,
                }}
              >
                <Typography.Text style={{ fontWeight: "bold" }}>
                  0{" "}
                  <Typography.Text style={{ color: "#01BEED" }}>
                    SOL
                  </Typography.Text>
                </Typography.Text>
              </div>
            </Flex>
          </Col>
        </Row>
      </div>
    </div>
  );
}
