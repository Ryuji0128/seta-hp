import type { Metadata } from "next";
import LegalPageLayout from "../_legal/LegalPageLayout";
import LegalInfoTable, { LegalInfoRow } from "../_legal/LegalInfoTable";

export const metadata: Metadata = {
  title: "会社情報 | 瀬田製作所",
  description:
    "瀬田製作所は富山県高岡市の個人事業所です。ソフトウェア受託開発を本業に、組み込みシステム・AI データ解析・3D プリント試作・ハンドメイドアクリルディスプレイ製造販売(飾Love)を行っています。",
  alternates: { canonical: "/company" },
};

const ROWS: LegalInfoRow[] = [
  { label: "屋号 / Legal Name", value: "瀬田製作所" },
  { label: "所在地 / Location", value: "富山県高岡市" },
  { label: "設立 / Founded", value: "2023年8月8日" },
  {
    label: "事業内容 / Business",
    value:
      "ソフトウェア受託開発(SaaS / Web アプリ / 組み込みシステム)\nAI データ解析・3D プリント試作\nハンドメイドアクリルディスプレイ製造販売(飾Love)",
  },
  {
    label: "サブブランド / Sub-brand",
    value: "飾Love(かざらぶ) — トレカディスプレイ事業 / kaza-love.com",
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
        <strong>瀬田製作所</strong> は、富山県高岡市の個人事業所です。
        SaaS / Web アプリ開発(Django・Next.js)、組み込みシステム(Raspberry Pi・Jetson・PLC)、
        回路・基板設計、AI データ解析、3D プリント試作を本業としています。
      </p>
      <p>
        サブブランド <strong>飾Love(かざらぶ)</strong> として、トレカコレクター向けの
        ハンドメイドアクリルディスプレイの製造販売も行っており、こちらは別ドメイン{" "}
        <a href="https://kaza-love.com">kaza-love.com</a> で展開予定です。
      </p>
      <LegalInfoTable rows={ROWS} />
    </LegalPageLayout>
  );
}
