import { Box } from "@mui/material";
import type { Metadata } from "next";
import HeroSection from "./_home/HeroSection";
import MarqueeSection from "./_home/MarqueeSection";
import CatalogueSection from "./_home/CatalogueSection";
import FeaturesSection from "./_home/FeaturesSection";
import CraftSection from "./_home/CraftSection";
import WorkshopSection from "./_home/WorkshopSection";
import QuizTeaserSection from "./_home/QuizTeaserSection";
import CTASection from "./_home/CTASection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "飾Love | MLBカード・トレカを美しく飾る",
  description:
    "大谷翔平の AWARD HISTORY 風壁面に、MLB・野球カードコレクターのための「ただ飾る」アクリルディスプレイ。富山県高岡市の工房からレーザー加工・3Dプリントで一つ一つ丁寧に製作、全国送料無料。",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <Box sx={{ bgcolor: "#FFFFFF" }}>
      <HeroSection />
      <MarqueeSection />
      <CatalogueSection />
      <FeaturesSection />
      <CraftSection />
      <WorkshopSection />
      <QuizTeaserSection />
      <CTASection />
    </Box>
  );
}
