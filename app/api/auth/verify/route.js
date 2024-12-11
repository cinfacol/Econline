import { authenticate } from "@/lib/auth-provider";
import { NextResponse } from "next/server";

export async function GET(request) {
  const isAuthenticated = await authenticate(request);

  if (isAuthenticated) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
