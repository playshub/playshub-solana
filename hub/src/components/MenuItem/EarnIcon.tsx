import { Image } from "antd";

export interface EarnIconProps {
  active: boolean;
}

export default function EarnIcon({ active }: EarnIconProps) {
  return active ? (
    <Image width={30} preview={false} src="/icons/menu/earn-active-icon.png" />
  ) : (
    <Image width={30} preview={false} src="/icons/menu/earn-default-icon.png" />
  );
}
