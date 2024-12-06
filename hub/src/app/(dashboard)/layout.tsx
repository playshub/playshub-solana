"use client";
import { Button, Layout, Menu, Result } from "antd";
import MenuItem from "../../components/MenuItem/MenuItem";
import PlayIcon from "../../components/MenuItem/PlayIcon";
import EarnIcon from "../../components/MenuItem/EarnIcon";
import RankIcon from "../../components/MenuItem/RankIcon";
import WalletIcon from "../../components/MenuItem/WalletIcon";
import InviteIcon from "../../components/MenuItem/InviteIcon";
import { PropsWithChildren, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DashboardContent from "@/components/dashboard/DashboardContent";

const { Content, Footer } = Layout;

export default function Dashboard({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();

  const activeKey = pathname.split("/")[1] || "play";

  const onSelect = async ({ key }: { key: string }) => {
    switch (key) {
      case "wallet":
        router.push("/wallet");
        break;
      case "play":
        router.push("/");
        break;
      case "earn":
        router.push("/earn");
        break;
      case "rank":
        router.push("/rank");
        break;
      case "invite":
        router.push("/invite");
        break;
    }
  };

  return (
    <div>
      <Layout>
        <Content
          style={{
            padding: "10px 10px",
            minHeight: "100vh",
            paddingBottom: 0,
          }}
        >
          <DashboardContent>{children}</DashboardContent>
          <div style={{ height: 68 }} />
        </Content>
        <Footer
          style={{
            padding: " 0px",
            position: "fixed",
            width: "100%",
            bottom: 0,
          }}
        >
          <Menu
            disabledOverflow
            onSelect={onSelect}
            style={{ width: "100%" }}
            mode="horizontal"
            items={[
              {
                key: "wallet",
                label: (
                  <MenuItem
                    active={activeKey === "wallet"}
                    title="Wallet"
                    icon={<WalletIcon active={activeKey === "wallet"} />}
                  />
                ),
              },
              {
                key: "earn",
                label: (
                  <MenuItem
                    active={activeKey === "earn"}
                    title="Earn"
                    icon={<EarnIcon active={activeKey === "earn"} />}
                  />
                ),
              },
              {
                key: "play",
                label: (
                  <MenuItem
                    active={activeKey === "play"}
                    title="Play"
                    icon={<PlayIcon active={activeKey === "play"} />}
                  />
                ),
              },
              {
                key: "invite",
                label: (
                  <MenuItem
                    active={activeKey === "invite"}
                    title="Invite"
                    icon={<InviteIcon active={activeKey === "invite"} />}
                  />
                ),
              },
              {
                key: "rank",
                label: (
                  <MenuItem
                    active={activeKey === "rank"}
                    title="Rank"
                    icon={<RankIcon active={activeKey === "rank"} />}
                  />
                ),
              },
            ]}
          ></Menu>
        </Footer>
      </Layout>
    </div>
  );
}
