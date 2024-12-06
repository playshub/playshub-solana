import { Image } from "antd";

export interface PlayIconProps {
  active: boolean;
}

export default function PlayIcon({ active }: PlayIconProps) {
  return active ? (
    <Image width={40} preview={false} src="/icons/menu/play-active-icon.png" />
  ) : (
    <Image width={40} preview={false} src="/icons/menu/play-default-icon.png" />
  );
}
