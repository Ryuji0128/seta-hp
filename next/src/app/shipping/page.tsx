import type { Metadata } from "next";
import LegalPageLayout from "../_legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "配送・返品について | 飾Love",
  description:
    "飾Love の配送方法・送料・返品ポリシーをご案内します。全国送料無料、緩衝材入りの梱包と配送保険付き。",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <LegalPageLayout
      titleJa="配送・返品について"
      titleEn="Shipping & Returns"
      eyebrow="Shipping · 配送について"
    >
      <h2>配送方法</h2>
      <p>
        ゆうパック、クリックポスト、レターパックのいずれかでお届けします。
        商品のサイズ・数量に応じて最適な配送方法を選択いたします。
      </p>

      <h2>送料</h2>
      <ul>
        <li>クリックポスト: 全国一律 185円</li>
        <li>レターパックライト: 全国一律 370円</li>
        <li>レターパックプラス: 全国一律 520円</li>
        <li>ゆうパック: 地域により異なります</li>
      </ul>
      <p>
        <strong>※ 3,980円以上のご購入で送料無料</strong>
      </p>

      <h2>お届け日数</h2>
      <p>
        ご注文確認後、通常 3〜7 営業日以内に発送いたします。
        受注生産品の場合は、商品ページに記載の日数をご確認ください。
      </p>

      <h2>返品・交換</h2>

      <h3>返品・交換の条件</h3>
      <p>商品到着後 7 日以内にメールにてご連絡ください。</p>

      <h3>お客様都合の返品</h3>
      <p>
        未開封・未使用の商品に限り、返品をお受けいたします。返送料はお客様のご負担となります。
        ※ 受注生産品・オーダーメイド品は返品をお受けできません。
      </p>

      <h3>不良品・誤配送の場合</h3>
      <p>
        商品に不良があった場合、または誤った商品が届いた場合は、
        送料当店負担にて交換または返金いたします。商品到着後 7 日以内にご連絡ください。
      </p>

      <h3>返金方法</h3>
      <p>
        ご返金はお支払い方法に応じて行います。
        クレジットカードの場合はカード会社経由、銀行振込の場合はご指定の口座へお振込みいたします。
      </p>
    </LegalPageLayout>
  );
}
