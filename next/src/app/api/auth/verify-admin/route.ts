import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/roles";
import { NextResponse } from "next/server";

/**
 * nginx の auth_request サブリクエスト用の管理者検証エンドポイント。
 *
 * 別アプリ（飾Love Designer など）を HP の管理者ログインでゲートするために使う。
 * - ADMIN セッションなら 200（本文は空・auth_request は本文を読まずステータスのみ判定）
 *   ＋ 身元ヘッダー（X-User-Email / X-User-Id / X-User-Role）を返す。
 *   nginx はこのヘッダーを auth_request_set で受け取り、下流アプリへ X-Remote-User として注入する。
 * - それ以外は 401（未認証）/ 403（権限なし）。
 *
 * env gate: SSO_VERIFY_ENABLED="1" の時のみ有効。未設定なら常に 403 を返し、
 * 本番で誤って公開・呼び出されても身元情報を一切漏らさない（既定 OFF）。
 */
export async function GET() {
  if (process.env.SSO_VERIFY_ENABLED !== "1") {
    return new NextResponse(null, { status: 403 });
  }

  const session = await auth();

  if (!session?.user) {
    return new NextResponse(null, { status: 401 });
  }

  if (!isAdminRole(session.user.role)) {
    return new NextResponse(null, { status: 403 });
  }

  const res = new NextResponse(null, { status: 200 });
  res.headers.set("X-User-Email", session.user.email ?? "");
  res.headers.set("X-User-Id", String(session.user.id ?? ""));
  res.headers.set("X-User-Role", session.user.role);
  return res;
}
