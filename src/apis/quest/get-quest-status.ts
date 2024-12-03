import { QUEST_REQUEST_TYPE, QUEST_TYPE } from "../../interfaces/quest";
import api from "../axios";

export const getQuestStatus = async (): Promise<
  {
    type: QUEST_TYPE;
    requestType: QUEST_REQUEST_TYPE;
    description: string;
    reward: `PLAYS:${number}`;
    progressAmount: number;
    requestAmount: number;
    additional: string | null;
    rewardedStep: number;
  }[]
> => {
  const { data } = await api.get("/plays-hub/quest_status");

  return data?.data_quests?.map((item: any) => ({
    type: item.type,
    requestType: item.request_type,
    description: item.description,
    reward: item.reward,
    progressAmount: item.progress_amount,
    requestAmount: item.request_amount,
    additional: item.additional,
    rewardedStep: item.rewarded_step,
  }));
};
