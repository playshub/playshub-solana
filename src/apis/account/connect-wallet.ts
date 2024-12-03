import api from "../axios";

export const connectTonWallet = async (address: string) => {
  const { data } = await api.post("/account/connect_ton_wallet", {
    wallet_address: address,
  });

  return data;
};

export const connectAptosWallet = async (address: string) => {
  const { data } = await api.post("/account/connect_aptos_wallet", {
    wallet_address: address,
  });

  return data;
};
