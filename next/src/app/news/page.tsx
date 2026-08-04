import type { Metadata } from "next";
import { requireAdminOrEditor } from "@/lib/admin-auth";
import AdminPageShell from "@/components/manage/AdminPageShell";
import NewsManagement from "./NewsManagement";

export const metadata: Metadata = {
  title: "お知らせ管理",
  robots: { index: false },
};

export default async function NewsPage() {
  const session = await requireAdminOrEditor();

  return (
    <AdminPageShell title="お知らせ管理">
      <NewsManagement session={session} />
    </AdminPageShell>
  );
}
