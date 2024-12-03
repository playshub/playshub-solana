import { getPlayerLeaderBoard } from "@/apis/leader-board/plays-leader-board";
import Rank from "./Rank";

export default async function RankPage() {
  const leaderboardData = await getPlayerLeaderBoard();
  return <Rank leaderboardData={leaderboardData} />;
}
