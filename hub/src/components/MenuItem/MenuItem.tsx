import { Flex, Typography } from "antd";

interface MenuItemProps {
  title: string;
  icon: React.ReactNode;
  active: boolean;
}

export default function MenuItem({ title, icon }: MenuItemProps) {
  return (
    <Flex vertical style={{ alignItems: "center" }}>
      {icon}
      <Typography.Text>{title}</Typography.Text>
    </Flex>
  );
}
