import api from "../axios";

export type PlayerLeaderBoardData = {
  displayName: string;
  plays: number;
  accountId: string;
}[];

export const getPlayerLeaderBoard = async (): Promise<
  { displayName: string; plays: number; accountId: string }[]
> => {
  const { data } = await api.get("/plays-hub/plays_leaderboard");
  return data.map((item: any) => ({
    accountId: item.account_id,
    displayName: item.display_name,
    plays: item.plays,
  }));
};
