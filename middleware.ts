import { NextRequest, NextResponse } from "next/server";
import { generateCsrfToken, setCsrfCookie } from "@/lib/csrf";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Set CSRF cookie for admin routes if not present
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const existingToken = request.cookies.get("csrf_token")?.value;

    if (!existingToken) {
      const token = generateCsrfToken();
      setCsrfCookie(response, token);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
