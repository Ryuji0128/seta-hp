// src/auth.config.ts
import { getPrismaClient } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const prisma = getPrismaClient();

// Google認証が設定されているかチェック
const googleProviderEnabled = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
    newUser: "/register",
  },

  providers: [
    // Google OAuth（環境変数が設定されている場合のみ有効）
    ...(googleProviderEnabled
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    // Email/Password認証
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "メールアドレス", type: "text" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "");
        const password = String(credentials?.password || "");

        if (!email || !password) {
          throw new Error("メールアドレス若しくはパスワードが入力されていません。");
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
          },
        });

        // ユーザー列挙攻撃対策: 存在チェックとパスワードチェックで同じメッセージ
        const invalidCredentialsMsg = "メールアドレスまたはパスワードが正しくありません。";

        if (!user) throw new Error(invalidCredentialsMsg);

        // パスワードがない場合（Google登録ユーザーなど）
        if (!user.password) {
          throw new Error("このアカウントはGoogle認証で登録されています。Googleでログインしてください。");
        }

        const passwordMatch = await bcryptjs.compare(password, String(user.password));
        if (!passwordMatch) throw new Error(invalidCredentialsMsg);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Google認証の場合、DBにユーザーを作成または更新
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            // 新規ユーザーを作成
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "Google User",
                image: user.image || null,
                role: "VIEWER",
              },
            });
          } else {
            // 既存ユーザーの画像を更新
            await prisma.user.update({
              where: { email: user.email },
              data: {
                image: user.image || existingUser.image,
              },
            });
          }
        } catch (error) {
          console.error("Google認証ユーザーの作成/更新に失敗:", error);
          return false; // ログイン失敗として扱う
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // ログイン直後（userが存在する時）
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;

        // Google認証の場合、画像を保存
        if (account?.provider === "google" && user.image) {
          token.picture = user.image;
        }
      }

      // JWTがすでに存在していて、userが無い（後続リクエスト）ときにも
      // roleが入っていなければ再取得して補完
      if (!token.role && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { role: true, image: true },
        });
        token.role = dbUser?.role || "VIEWER";
        if (dbUser?.image) {
          token.picture = dbUser.image;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = (token.role as "ADMIN" | "EDITOR" | "VIEWER") ?? "VIEWER";
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }

      return session;
    },
  },

} satisfies NextAuthConfig;

export default authConfig;
