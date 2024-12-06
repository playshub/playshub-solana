import { useSignal, initData, type User } from "@telegram-apps/sdk-react";

export default function useTelegramUser(): User | undefined {
  const initDataState = useSignal(initData.state);
  return initDataState?.user;
}
