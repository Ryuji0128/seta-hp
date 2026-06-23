import PageHero from "@/components/PageHero";

interface Props {
  count: number;
}

const GalleryHero = ({ count }: Props) => (
  <PageHero
    eyebrow="Gallery · 制作事例"
    heading={
      <>
        これまでの<br />
        <em>仕事。</em>
      </>
    }
    subtitle="— Selected works from the workshop."
    stats={[
      { value: count, label: "Works on display" },
      { value: "Solo", label: "One maker" },
    ]}
  />
);

export default GalleryHero;
