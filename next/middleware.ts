import { auth } from "@/lib/auth";

/**
 * 管理ページの多層防御（#248）。
 * ページ側の requireAdminOrEditor と同じ判定を middleware 層でも行い、
 * 未認証・権限不足のリクエストをページ描画前に遮断する。
 */
export default auth((req) => {
  // 未認証 → ログインへ
  if (!req.auth) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // 権限不足（ADMIN/EDITOR 以外）→ トップへ
  const role = req.auth.user?.role;
  if (role !== "ADMIN" && role !== "EDITOR") {
    return Response.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: [
    "/products-manage/:path*",
    "/gallery-manage/:path*",
    "/news/:path*",
  ],
};
