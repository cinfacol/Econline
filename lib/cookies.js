import { getCookie } from "cookies-next";

const getAuthCookie = (access) => {
  const cookie = getCookie(access);

  if (!cookie) return undefined;

  return Buffer.from(cookie, "base64").toString("ascii");
};

export const getValidAuthTokens = () => {
  const token = getAuthCookie("access");

  const now = new Date();
  const tokenDate = new Date(token || 0);

  return {
    token: now < tokenDate ? token : undefined,
  };
};
