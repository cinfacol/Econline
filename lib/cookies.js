import { cookies } from "next/headers";

export default async function getAuthCookie() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("access");

  if (!cookie) return undefined;

  return { cookie };
}
