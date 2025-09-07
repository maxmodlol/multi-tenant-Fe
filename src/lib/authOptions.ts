// src/lib/authOptions.ts
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { Role } from "@/src/app/(dashboard)/dashboard/settings/settings-config";
import { detectTenant } from "@/src/config/detectTenant";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(creds) {
        const tenant = await detectTenant();
        const res = await fetch(`${process.env.API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant": tenant,
          },
          body: JSON.stringify(creds),
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.tenant = (user as any).tenant;
        token.raw = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.tenant = token.tenant as string;
        session.user.token = token.raw as string;
        
        // Fetch user profile data including avatarUrl
        if (token.raw) {
          try {
            const tenant = token.tenant as string;
            const profileRes = await fetch(`${process.env.API_URL}/auth/me/profile`, {
              headers: {
                'Authorization': `Bearer ${token.raw}`,
                'x-tenant': tenant,
              },
            });
            if (profileRes.ok) {
              const profile = await profileRes.json();
              session.user.avatarUrl = profile.avatarUrl;
            }
          } catch (error) {
            console.error('Failed to fetch user profile:', error);
          }
        }
      }
      return { ...session, token: token.raw as string };
    },
  },
};
