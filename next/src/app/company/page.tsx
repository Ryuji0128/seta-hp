import type { Metadata } from "next";
import LegalPageLayout from "../_legal/LegalPageLayout";
import LegalInfoTable, { LegalInfoRow } from "../_legal/LegalInfoTable";

export const metadata: Metadata = {
  title: "会社情報 | SETA Craft",
  description:
    "SETA Craft は、瀬田製作所のハンドメイドブランドです。富山県高岡市で、ものづくり・試作・カードディスプレイ製作を行っています。",
  alternates: { canonical: "/company" },
};

const ROWS: LegalInfoRow[] = [
  { label: "屋号 / Brand", value: "SETA Craft" },
  { label: "運営 / Operated by", value: "瀬田製作所" },
  { label: "所在地 / Location", value: "富山県高岡市" },
  { label: "設立 / Founded", value: "2023年8月8日" },
  {
    label: "事業内容 / Business",
    value:
      "ハンドメイドアクリルディスプレイ製造販売\nソフトウェア受託開発・試作・ものづくり全般",
  },
  { label: "Email", value: "info@setaseisakusyo.com" },
];

export default function CompanyPage() {
  return (
    <LegalPageLayout
      titleJa="会社情報"
      titleEn="Company"
      eyebrow="Company · 運営会社について"
    >
      <p>
        SETA Craft は、富山県高岡市の <strong>瀬田製作所</strong> が運営する
        ハンドメイドブランドです。
        本業のソフトウェア受託開発で培った設計力と、ものづくりの街・高岡の伝統を背景に、
        コレクター向けのアクリルディスプレイを一つずつ手作りでお届けしています。
      </p>
      <LegalInfoTable rows={ROWS} />
    </LegalPageLayout>
  );
}
