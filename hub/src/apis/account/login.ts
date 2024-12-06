import { setJwtToken } from "../../utils/storage";
import api from "../axios";

export const login = async (
  telegramId: string,
  displayName: string,
  languageCode: string,
  referralId?: string
) => {
  const response = await api.post("/account/login", {
    telegram_id: telegramId,
    display_name: displayName,
    referral_id: referralId,
    language_code: languageCode,
  });
  const token = response.data.access_token;
  setJwtToken(token);
  return token;
};
