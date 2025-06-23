// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET!;
const PUBLIC_PATHS = ["/login", "/api/auth"]; // public routes
const PROTECTED_PREFIX = "/dashboard"; // guard everything under /dashboard

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // 1️⃣ Skip _next/static, images, api/auth next-auth, favicon, etc.
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Tenant detection from the Host header (x-forwarded-host if behind CF)
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host")!;
  const hostname = host.split(":")[0];
  const parts = hostname.split(".");
  const tenant = hostname === "localhost" || parts.length < 3 ? "main" : parts[0];

  // 3️⃣ Attach the tenant as a cookie & header so your app code can read it
  const res = NextResponse.next();
  res.cookies.set("x-tenant", tenant, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
  });
  res.headers.set("x-tenant", tenant);

  // 4️⃣ Authentication guards
  const session = await getToken({ req, secret: SECRET });
  if (pathname.startsWith(PROTECTED_PREFIX) && !session) {
    return NextResponse.redirect(new URL("/login", origin));
  }
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  return res;
}

export const config = {
  // run this on everything except static files & the auth callbacks
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
