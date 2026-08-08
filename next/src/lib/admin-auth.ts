import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { isEditorRole } from "@/lib/roles";

/**
 * 管理ページ共通の認証ガード。
 * 未ログインは /login へ、ADMIN/EDITOR 以外はトップへリダイレクトする。
 */
export async function requireAdminOrEditor(): Promise<Session> {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!isEditorRole(session.user.role)) {
    redirect("/");
  }

  return session;
}
