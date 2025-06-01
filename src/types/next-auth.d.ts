// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "../../app/(dashboard)/settings/settings-config";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      /** the tenant / sub-domain this user belongs to */
      tenant: string;
      /** your custom role field */
      role: Role;
      /** raw JWT returned from login */
      token: string;
      /** your database user id */
      id: string;
    };
    status: "authenticated" | "unauthenticated" | "loading";
  }

  interface User extends DefaultUser {
    /** your database user id */
    id: string;
    role: Role;
    tenant: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    tenant?: string;
    raw?: string;
    /** include the user id in the token too */
    id?: string;
  }
}
