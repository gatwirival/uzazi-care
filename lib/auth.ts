import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

// Dynamic import to avoid bundling Prisma in edge runtime
async function getUserByEmail(email: string) {
  const { prisma } = await import("@/lib/db");
  return prisma.user.findUnique({
    where: { email },
    include: {
      Hospital: {
        select: {
          id: true,
          name: true,
          subscriptionStatus: true,
          isActive: true,
        },
      },
    },
  });
}

async function verifyPassword(password: string, hash: string) {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, hash);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await getUserByEmail(credentials.email as string);

        if (!user) {
          return null;
        }

        // Check if user is active
        if (!user.isActive) {
          throw new Error('Your account has been deactivated. Please contact your hospital administrator.');
        }

        // For DOCTOR and HOSPITAL_ADMIN, check hospital status
        if (user.role === 'DOCTOR' || user.role === 'HOSPITAL_ADMIN') {
          if (!user.Hospital) {
            throw new Error('No hospital associated with this account.');
          }

          if (!user.Hospital.isActive) {
            throw new Error('Your hospital account has been suspended. Please contact support.');
          }
        }

        const isValidPassword = await verifyPassword(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValidPassword) {
          return null;
        }

        // Update last login
        const { prisma } = await import("@/lib/db");
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hospitalId: user.hospitalId || undefined,
          subscriptionStatus: user.Hospital?.subscriptionStatus,
        };
      },
    }),
  ],
});
