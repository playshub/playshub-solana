import { Image } from "antd";

export interface InviteIconProps {
  active: boolean;
}

export default function InviteIcon({ active }: InviteIconProps) {
  return active ? (
    <Image
      width={40}
      preview={false}
      src="/icons/menu/invite-active-icon.png"
    />
  ) : (
    <Image
      width={40}
      preview={false}
      src="/icons/menu/invite-default-icon.png"
    />
  );
}
