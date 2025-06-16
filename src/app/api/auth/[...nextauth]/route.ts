// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { Role } from "@/src/app/(dashboard)/dashboard/settings/settings-config";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(creds) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(creds),
          credentials: "include", // this only affects server→server
        });
        if (!res.ok) return null;
        const { user, token } = await res.json();
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenant: user.tenant,
          token,
        };
      },
    }),
  ],
  // [...nextauth].ts
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // ← grab the DB-user’s id

        token.role = (user as any).role;
        token.tenant = (user as any).tenant;
        token.raw = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      // inject tenant/role under session.user
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.tenant = token.tenant as string;
        session.user.token = token.raw as string;
      }

      // return the raw JWT as a top-level `token` field
      return {
        ...session,
        token: token.raw as string,
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
