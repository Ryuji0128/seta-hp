import type { Metadata } from "next";
import LegalPageLayout from "../_legal/LegalPageLayout";
import LegalInfoTable, { LegalInfoRow } from "../_legal/LegalInfoTable";

export const metadata: Metadata = {
  title: "会社情報 | 飾Love",
  description:
    "飾Love(かざらぶ)は、富山県高岡市の小さな工房から、MLBカード・トレカコレクター向けのハンドメイドアクリルディスプレイをお届けする新ブランドです。運営は個人事業所「瀬田製作所」。",
  alternates: { canonical: "/company" },
};

const ROWS: LegalInfoRow[] = [
  { label: "ブランド名 / Brand", value: "飾Love(かざらぶ)" },
  { label: "屋号 / Legal Name", value: "瀬田製作所(個人事業所)" },
  { label: "所在地 / Location", value: "富山県高岡市" },
  { label: "設立 / Founded", value: "2023年8月8日" },
  {
    label: "事業内容 / Business",
    value:
      "ハンドメイドアクリルディスプレイの製造販売(飾Love)\nレーザー加工・3Dプリント試作",
  },
  { label: "Email", value: "info@kaza-love.com" },
];

export default function CompanyPage() {
  return (
    <LegalPageLayout
      titleJa="会社情報"
      titleEn="Company"
      eyebrow="Company · 飾Love について"
    >
      <p>
        <strong>飾Love(かざらぶ)</strong> は、富山県高岡市の小さな工房から、
        MLBカード・トレカコレクターのための、ハンドメイドアクリルディスプレイをお届けする新ブランドです。
        レーザー加工と3Dプリントで、ひとつずつ丁寧に製作しています。
      </p>
      <p>
        飾Love の運営事業者は、富山県高岡市の個人事業所「<strong>瀬田製作所</strong>」です。
        個人事業所の屋号として「瀬田製作所」を登録しており、新ブランド「飾Love」として
        アクリルディスプレイの製造販売事業を行っています。
      </p>
      <LegalInfoTable rows={ROWS} />
    </LegalPageLayout>
  );
}
