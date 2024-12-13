"use client";

import { WagmiProvider } from "wagmi";
import { config } from "@/core/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ConfigProvider } from "antd";
import NotificationProvider from "@/components/providers/NotificationProvider";
import { AptosWalletProvider } from "@/components/providers/AptosWalletProvider";
import { PropsWithChildren } from "react";
import { SolWalletProvider } from "./SolanaWalletProvider";
import { SOLANA_RPC_URL } from "@/utils/constants";

const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TonConnectUIProvider manifestUrl="https://game.playshub.io/tonconnect-manifest.json">
          <NotificationProvider>
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: "myriadpro-regular",
                },
              }}
            >
              <AptosWalletProvider>
                <SolWalletProvider rpcUrl={SOLANA_RPC_URL}>
                  {children}
                </SolWalletProvider>
              </AptosWalletProvider>
            </ConfigProvider>
          </NotificationProvider>
        </TonConnectUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
