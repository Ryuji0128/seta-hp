import { redirect } from "next/navigation";

// /works-manage は /gallery-manage に統合された（同一の Work リソースを CRUD する
// 重複した管理画面だったため・#194）。旧URLは 404 にせず常設で /gallery-manage へ
// リダイレクトする。認証は遷移先の /gallery-manage 側で行う。
export default function WorksManagePage() {
  redirect("/gallery-manage");
}
