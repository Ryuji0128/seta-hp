import { getPrismaClient } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "../../auth.config";

const prisma = getPrismaClient();

// --- SSO: クロスサブドメインで NextAuth セッション Cookie を共有するための設定 ---
// 別アプリ（飾Love Designer = designer.kaza-love.com 等）を HP のログインでゲートする際、
// Cookie を親ドメイン（.kaza-love.com）まで広げて両ホストへ送れるようにする。
// SSO_COOKIE_DOMAIN が未設定なら cookies 設定自体を出さず、NextAuth デフォルト
// （HostOnly Cookie）のまま＝本番挙動は不変（既定 OFF）。
const ssoCookieDomain = process.env.SSO_COOKIE_DOMAIN?.trim() || undefined;
// secure は既定で本番(NODE_ENV=production)のみ true。ローカル http PoC では SSO_COOKIE_SECURE=0。
const ssoCookieSecure =
  process.env.SSO_COOKIE_SECURE !== undefined
    ? process.env.SSO_COOKIE_SECURE === "1"
    : process.env.NODE_ENV === "production";

const ssoCookies = ssoCookieDomain
  ? {
      cookies: {
        sessionToken: {
          // ★既定名(authjs.session-token)とは別名にする。
          // 既存ユーザーが持つ HostOnly な authjs.session-token と「同名・別スコープ」で
          // 共存すると Cookie ヘッダが二重になりセッションが壊れるため、SSO用は独立した名前に。
          // 移行時は旧Cookieとは別物として扱われ、ユーザーは一度だけ再ログイン→新Cookie発行。
          // __Host- は Domain 禁止のため使わない。secure時のみ __Secure- 接頭辞を付ける。
          name: ssoCookieSecure
            ? "__Secure-kazalove.session-token"
            : "kazalove.session-token",
          options: {
            httpOnly: true,
            sameSite: "lax" as const,
            path: "/",
            domain: ssoCookieDomain,
            secure: ssoCookieSecure,
          },
        },
      },
    }
  : {};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  jwt: { maxAge: 24 * 60 * 60 },
  ...ssoCookies,
  ...authConfig,
});
