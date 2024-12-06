import api from "../axios";

export const getLeaderboardPosition = async (): Promise<number> => {
  const { data } = await api.get("/plays-hub/plays_leaderboard_position");

  return data.plays_rank;
};
