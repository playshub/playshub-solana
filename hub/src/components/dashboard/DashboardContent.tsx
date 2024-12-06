import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../apis/account/login";
import useTelegramUser from "../../hooks/useTelegramUser";
import Loading from "../../components/spin/Loading";
import { PropsWithChildren, useEffect } from "react";
import { Button, Result } from "antd";

export default function DashboardContent({ children }: PropsWithChildren) {
  const user = useTelegramUser()!;
  const launchParams = useLaunchParams();
  const referralId = launchParams.initData?.startParam;

  const { isError, mutate, error } = useMutation({
    mutationFn: () =>
      login(
        user?.id?.toString(),
        `${user?.firstName || ""} ${user?.lastName || ""}`,
        user.languageCode || "en",
        referralId ? referralId.match(/ref_(\w+)/)?.[1] : undefined
      ),
  });

  useEffect(() => {
    mutate();
  }, []);

  if (!user) {
    return (
      <Result status="403" title="403" subTitle="Not supported platform." />
    );
  }

  if (isError) {
    if (error.name === "UnauthorizedError") {
      return (
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button
              type="primary"
              onClick={() => {
                mutate();
              }}
            >
              Retry
            </Button>
          }
        />
      );
    } else {
      return (
        <Result
          status="500"
          title=""
          subTitle="Server is under maintenance, please visit again few minutes!."
        />
      );
    }
  }

  return children;
}
