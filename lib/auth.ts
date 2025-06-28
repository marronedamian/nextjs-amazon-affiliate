import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import type { NextAuthOptions, Session } from "next-auth";
import { getServerSession as _getServerSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      username?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id?: string;
    name?: string | null;
    username?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await db.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        const base = user.email!.split("@")[0];
        let username = base;
        let count = 1;

        while (await db.user.findUnique({ where: { username } })) {
          username = `${base}${count++}`;
        }

        // Creamos el usuario manualmente
        const newUser = await db.user.create({
          data: {
            email: user.email!,
            name: user.name,
            image: user.image,
            username,
          },
        });

        // Vinculamos la cuenta externa al usuario creado
        await db.account.create({
          data: {
            userId: newUser.id,
            type: account!.type,
            provider: account!.provider,
            providerAccountId: account!.providerAccountId,
            access_token: account!.access_token,
            token_type: account!.token_type,
            id_token: account!.id_token,
            scope: account!.scope,
            expires_at: account!.expires_at,
            refresh_token: account!.refresh_token,
          },
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      if (session.user && token.username) {
        session.user.username = token.username as string;
      }
      return session;
    },
  },
};

export async function getServerAuthSession() {
  return await _getServerSession(authOptions);
}
