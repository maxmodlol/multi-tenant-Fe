// middleware.ts  (root of the repo)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt"; // ← edge-safe helper

const PUBLIC = ["/login"]; // public routes
const PROTECTED_PREFIX = "/dashboard"; // everything under /dashboard
const SECRET = process.env.NEXTAUTH_SECRET!; // same you passed to NextAuth

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  /* decode JWT (null ⇒ not signed-in) */
  const session = await getToken({ req, secret: SECRET });

  /* 1. Visiting a protected page without a session → /login */
  if (pathname.startsWith(PROTECTED_PREFIX) && !session) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  /* 2. Signed-in user hitting /login → /dashboard */
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  return NextResponse.next();
}

/* Where should the middleware run? */
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
