import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC = ["/login"];
const PROTECTED_PREFIX = "/dashboard";
const SECRET = process.env.NEXTAUTH_SECRET!;

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const session = await getToken({ req, secret: SECRET });

  // 👇 1. Determine tenant from host
  const host = req.headers.get("host") || "";
  const subdomain = host.includes(".") ? host.split(".")[0] : "main";
  console.log("host sub", host, "sub ", subdomain);
  // 👇 2. Clone response and set tenant cookie
  const res = NextResponse.next();
  res.cookies.set("x-tenant", subdomain, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    // let client-side read it too if needed
  });

  // 👇 3. Auth redirects
  if (pathname.startsWith(PROTECTED_PREFIX) && !session) {
    return NextResponse.redirect(new URL("/login", origin));
  }
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
