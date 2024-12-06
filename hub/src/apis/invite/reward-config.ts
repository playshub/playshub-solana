import api from "../axios";

export const getInviteRewardConfig = async () => {
  const { data } = await api.get("/plays-hub/invite_reward_config");

  return {
    normalInvite: data.normal_invite,
    premiumInvite: data.premium_invite,
  };
};
