/* src/lib/auth.ts -------------------------------------------------- */
"use client";

import {
  useSession, // ↙  client hook
  signIn as _signIn,
  signOut as _signOut,
} from "next-auth/react";

export const useAuth = useSession;

export const signIn = _signIn;
export const signOut = _signOut;
