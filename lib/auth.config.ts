import type { NextAuthConfig } from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      hospitalId?: string;
      subscriptionStatus?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    hospitalId?: string;
    subscriptionStatus?: string;
  }

  interface JWT {
    id?: string;
    role?: string;
    hospitalId?: string;
    subscriptionStatus?: string;
  }
}

/**
 * Lightweight auth config used by middleware (no Prisma / bcryptjs).
 * Keep this file free of any heavy Node.js-only imports so the edge
 * runtime can bundle it within Vercel's 1 MB limit.
 */
export const authConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/api/patients") ||
        nextUrl.pathname.startsWith("/api/files") ||
        nextUrl.pathname.startsWith("/api/analyze") ||
        nextUrl.pathname.startsWith("/api/chat");

      if (isProtected) {
        return isLoggedIn; // redirect to signIn when false
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.hospitalId = (user as { hospitalId?: string }).hospitalId;
        token.subscriptionStatus = (user as { subscriptionStatus?: string }).subscriptionStatus;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.hospitalId = token.hospitalId as string | undefined;
        session.user.subscriptionStatus = token.subscriptionStatus as string | undefined;
      }
      return session;
    },
  },
  providers: [], // providers are added in auth.ts (Node.js runtime only)
} satisfies NextAuthConfig;
