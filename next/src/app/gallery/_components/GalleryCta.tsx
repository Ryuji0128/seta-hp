import DarkCtaSection from "@/components/DarkCtaSection";

const GalleryCta = () => (
  <DarkCtaSection
    heading={
      <>
        こんなのが
        <br />
        <em>作れますか?</em>
      </>
    }
    body={
      <>
        特注品・大型品・サイズや形状の個別調整など、お気軽にご相談ください。
        一品から制作します。
      </>
    }
    primaryLabel="お問い合わせ"
    secondaryHref="/products"
    secondaryLabel="カタログを見る"
  />
);

export default GalleryCta;
