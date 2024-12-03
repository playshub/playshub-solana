"use client";

import { WagmiProvider } from "wagmi";
import { config } from "@/core/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ConfigProvider } from "antd";
import NotificationProvider from "@/components/providers/NotificationProvider";
import { AptosWalletProvider } from "@/components/providers/AptosWalletProvider";
import { PropsWithChildren } from "react";
import {
  OKXWallet,
  PhantomWallet,
  SolanaWeb3ConfigProvider,
  WalletConnectWallet,
} from "@ant-design/web3-solana";

const queryClient = new QueryClient();

const rpcProvider = () =>
  `https://api.zan.top/node/v1/solana/mainnet/${process.env.NEXT_PUBLIC_ZAN_API_KEY}`;

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
                <SolanaWeb3ConfigProvider
                  autoAddRegisteredWallets
                  rpcProvider={rpcProvider}
                  wallets={[
                    PhantomWallet(),
                    OKXWallet(),
                    WalletConnectWallet(),
                  ]}
                  walletConnect={{
                    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
                  }}
                >
                  {children}
                </SolanaWeb3ConfigProvider>
              </AptosWalletProvider>
            </ConfigProvider>
          </NotificationProvider>
        </TonConnectUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
