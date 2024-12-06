import { PropsWithChildren } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { useNotification } from "./NotificationProvider";

export function AptosWalletProvider({ children }: PropsWithChildren) {
  const notification = useNotification()!;
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: Network.MAINNET,
        mizuwallet: {
          manifestURL:
            "https://dev-game.playshub.io/mizuwallet-connect-manifest.json",
        },
      }}
      optInWallets={["Mizu Wallet"]}
      onError={(error) => {
        notification.error("Error", error || "Unknown wallet error");
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
