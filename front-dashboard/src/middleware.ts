// front-dashboard/src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC = ["/", "/login", "/register", "/_next", "/favicon.ico", "/public"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.some(p => pathname === p || pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get("access_token")?.value;
  if (!token && pathname !== "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
