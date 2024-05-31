import { cookies } from "next/headers";

export const getAuthCookie = (req) => {
  const cookieStore = cookies(req);
  const cookie = cookieStore.get("access");

  if (!cookie) return undefined;

  return { cookie };
};
