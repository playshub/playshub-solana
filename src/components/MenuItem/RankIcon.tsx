import { Image } from "antd";

export interface RankIconProps {
  active: boolean;
}

export default function RankIcon({ active }: RankIconProps) {
  return active ? (
    <Image width={40} preview={false} src="/icons/menu/rank-active-icon.png" />
  ) : (
    <Image width={40} preview={false} src="/icons/menu/rank-default-icon.png" />
  );
}
