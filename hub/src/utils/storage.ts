export const getJwtToken = () => {
  return localStorage.getItem("jwt_token");
};

export const setJwtToken = (token: string) => {
  localStorage.setItem("jwt_token", token);
};
