import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth-provider";

// Función principal del middleware
export function middleware(request) {
  const isAuthenticated = authenticate(request);

  if (isAuthenticated) {
    return NextResponse.next(); // Permite continuar si está autenticado
  }

  // Redirige a /login si no está autenticado
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/payment/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/checkout/:path*",
    "/dashboard/:path*",
  ],
};
