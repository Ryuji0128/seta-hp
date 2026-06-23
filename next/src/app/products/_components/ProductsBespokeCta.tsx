import DarkCtaSection from "@/components/DarkCtaSection";

const ProductsBespokeCta = () => (
  <DarkCtaSection
    heading={
      <>
        既製品にない、
        <br />
        <em>あなただけの一品。</em>
      </>
    }
    body={
      <>
        50枚以上の大型システム、AWARD HISTORY のような特注品、
        サイズ・形状のカスタマイズなど、お気軽にご相談ください。
        一品からお作りします。
      </>
    }
    primaryLabel="特注品のご相談"
    secondaryHref="/gallery"
    secondaryLabel="制作事例を見る"
  />
);

export default ProductsBespokeCta;
