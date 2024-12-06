import api from "../axios";

export const getProfile = async () => {
  const { data } = await api.get("/account/profile");
  return {
    account: {
      accountId: data.account.account_id,
      displayName: data.account.display_name,
      avatar: 0,
    },
    currency: {
      ton: data.currency.ton,
      bnb: data.currency.bnb,
      plays: data.currency.plays,
    },
  };
};
