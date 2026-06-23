import PageHero from "@/components/PageHero";

interface Props {
  count: number;
}

const ProductsHero = ({ count }: Props) => (
  <PageHero
    eyebrow="Catalogue · 商品一覧"
    heading={
      <>
        飾るための、<br />
        <em>道具一式。</em>
      </>
    }
    subtitle="— Built for collectors who actually display their cards."
    statsWrap
    stats={[
      { value: count, label: "Products listed" },
      { value: "¥0", label: "全国送料無料" },
      { value: "100%", label: "Hand-finished" },
    ]}
  />
);

export default ProductsHero;
