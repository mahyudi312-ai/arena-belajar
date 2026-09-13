import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("Email belum terdaftar");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Password salah");

        const now = new Date();
        const last = user.lastLoginAt;
        const isNewDay =
          !last || now.toDateString() !== last.toDateString();

        if (isNewDay) {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const isConsecutive =
            last && yesterday.toDateString() === last.toDateString();

          await prisma.user.update({
            where: { id: user.id },
            data: {
              streak: isConsecutive ? user.streak + 1 : 1,
              lastLoginAt: now,
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          kelas: user.kelas,
          avatar: user.avatar,
          exp: user.exp,
          level: user.level,
          kristal: user.kristal,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.kelas = (user as any).kelas;
        token.avatar = (user as any).avatar;
        token.exp = (user as any).exp;
        token.level = (user as any).level;
        token.kristal = (user as any).kristal;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).kelas = token.kelas;
        (session.user as any).avatar = token.avatar;
        (session.user as any).exp = token.exp;
        (session.user as any).level = token.level;
        (session.user as any).kristal = token.kristal;
      }
      return session;
    },
  },
};
