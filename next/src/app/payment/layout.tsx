import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "サービス・お支払い",
  description:
    "瀬田製作所のサービスお支払いページ。HP新規作成、HP管理・保守、モックアップ作成などのサービス料金をお支払いいただけます。",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/payment",
  },
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
