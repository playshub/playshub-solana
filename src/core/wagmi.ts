import { http, createConfig } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [bscTestnet],
  connectors: [
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! }),
  ],
  transports: {
    [bscTestnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
