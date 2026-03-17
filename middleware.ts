import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Lightweight edge middleware — no Prisma/bcryptjs imports here
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/patients/:path*",
    "/api/files/:path*",
    "/api/analyze/:path*",
    "/api/chat/:path*",
    "/api/doctors/:path*",
    "/api/reports/:path*",
  ],
};
