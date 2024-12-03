import { Image } from "antd";

export interface WalletIconProps {
  active: boolean;
}

export default function WalletIcon({ active }: WalletIconProps) {
  return active ? (
    <Image
      width={30}
      preview={false}
      src="/icons/menu/wallet-active-icon.png"
    />
  ) : (
    <Image
      width={30}
      preview={false}
      src="/icons/menu/wallet-default-icon.png"
    />
  );
}
