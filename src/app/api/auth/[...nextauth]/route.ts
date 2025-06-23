// src/app/api/auth/[...nextauth]/route.ts

import { authOptions } from "@/src/lib/authOptions";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
