import type { Metadata } from "next";
import LegalPageLayout from "../_legal/LegalPageLayout";
import PrivacyPolicy from "./PrivacyPolicy";

export const metadata: Metadata = {
  title: "プライバシーポリシー | SETA Craft",
  description:
    "SETA Craft (瀬田製作所) のプライバシーポリシー。個人情報の取り扱い、利用目的、第三者提供についてご説明します。",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      titleJa="プライバシーポリシー"
      titleEn="Privacy Policy"
      eyebrow="Privacy · 個人情報の取り扱い"
    >
      <p>
        SETA Craft (以下「当サイト」) は、お客様の個人情報を以下のとおり取り扱います。
      </p>
      <PrivacyPolicy />
    </LegalPageLayout>
  );
}
