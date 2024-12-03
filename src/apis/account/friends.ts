import api from "../axios";

export const getFriends = async (): Promise<
  { accountId: string; displayName: string; plays: number }[]
> => {
  const { data } = await api.get("/account/list_friend");
  return data?.friends?.map((item: any) => ({
    accountId: item.account_id,
    displayName: item.display_name,
    plays: item.plays,
  }));
};
