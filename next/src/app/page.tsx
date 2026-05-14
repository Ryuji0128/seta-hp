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
    "MLBカード・トレカを美しく飾るための、富山県高岡市の小さな工房から。レーザー加工と3Dプリントで一つずつ手作りのアクリルディスプレイ。全国送料無料。",
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
