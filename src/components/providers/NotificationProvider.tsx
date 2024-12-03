import { WarningOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { createContext, PropsWithChildren, useContext } from "react";

export interface NotificationContextValueProps {
  success: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
}

export interface NotificationContextProps {}

const NotificationContext = createContext<NotificationContextValueProps | null>(
  null
);

export const useNotification = () => useContext(NotificationContext);

function NotificationProvider({
  children,
}: PropsWithChildren<NotificationContextProps>) {
  const [api, contextHolder] = notification.useNotification({
    placement: "top",
  });

  const success = (message: string, description?: string) => {
    api.success({
      message,
      description,
      closeIcon: null,
    });
  };

  const info = (message: string, description?: string) => {
    api.info({
      message,
      description,
      closeIcon: null,
    });
  };
  const warning = (message: string, description?: string) => {
    api.warning({
      message,
      description,
      closeIcon: null,
      icon: <WarningOutlined />,
    });
  };
  const error = (message: string, description?: string) => {
    api.error({
      message,
      description,
      closeIcon: null,
    });
  };

  return (
    <NotificationContext.Provider value={{ success, info, warning, error }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
