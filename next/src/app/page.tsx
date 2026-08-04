import { Box } from "@mui/material";
import type { Metadata } from "next";
import HeroSection from "./_home/HeroSection";
import MarqueeSection from "./_home/MarqueeSection";
import CatalogueSection from "./_home/CatalogueSection";
import { getCatalogueProducts } from "./_home/getCatalogueProducts";
import { getRandomHeroImage } from "./_home/getRandomHeroImage";
import FeaturesSection from "./_home/FeaturesSection";
import QuizTeaserSection from "./_home/QuizTeaserSection";
import CTASection from "./_home/CTASection";

// ヒーロー画像の抽選をリクエスト毎に行うため動的レンダリングとする。
// 表示データ自体は unstable_cache（products タグ）でキャッシュ済みのため、DBアクセスは発生しない。
// ※ CIビルド時はDBに到達できないため、静的生成（ISR）にはしない。
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "飾Love | MLBカード・トレカを美しく飾る",
  description:
    "MLBカード・トレカを美しく飾るための、小さな個人工房から。レーザー加工で一つずつ手作りのアクリルディスプレイ。全国送料無料。",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const [catalogueProducts, heroImage] = await Promise.all([
    getCatalogueProducts(),
    getRandomHeroImage(),
  ]);

  return (
    <Box sx={{ bgcolor: "#FFFFFF" }}>
      <HeroSection heroImage={heroImage} />
      <MarqueeSection />
      <CatalogueSection products={catalogueProducts} />
      <FeaturesSection />
      <QuizTeaserSection />
      <CTASection />
    </Box>
  );
}
