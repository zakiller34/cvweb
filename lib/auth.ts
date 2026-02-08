import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { trackSecurityEvent } from "./analytics";
import { getClientIp } from "./ratelimit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const ip = getClientIp(request);
        const ua = request.headers.get("user-agent") ?? "";

        if (!credentials?.email || !credentials?.password) {
          trackSecurityEvent({ type: "failed_login", ip, detail: "missing credentials", userAgent: ua });
          return null;
        }

        const email = credentials.email as string;
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          trackSecurityEvent({ type: "failed_login", ip, detail: email, userAgent: ua });
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) {
          trackSecurityEvent({ type: "failed_login", ip, detail: email, userAgent: ua });
          return null;
        }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
