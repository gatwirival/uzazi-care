import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Only the lightweight authConfig is imported here — no Prisma, no bcryptjs.
// This keeps the edge function well under Vercel's 1 MB limit.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/dashboard/:path*", "/api/patients/:path*", "/api/files/:path*", "/api/analyze/:path*", "/api/chat/:path*"],
};
