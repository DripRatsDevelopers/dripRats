import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const protectedPaths = ["/checkout"];

  const token = request.cookies.get("authToken")?.value;

  if (protectedPaths.some((path) => pathname.startsWith(path)) && !token) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname + request.nextUrl.search);

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}
