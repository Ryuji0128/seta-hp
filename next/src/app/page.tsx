import { Box } from "@mui/material";
import type { Metadata } from "next";
import HeroSection from "./_home/HeroSection";
import CategoryNavSection from "./_home/CategoryNavSection";
import FeaturedProductsSection from "./_home/FeaturedProductsSection";
import FeaturesSection from "./_home/FeaturesSection";
import CTASection from "./_home/CTASection";

export const metadata: Metadata = {
  title: "SETA Craft | カード好きが作ったディスプレイ",
  description:
    "カード好きが作った、こだわりのディスプレイ。トレカ、ポケカ、遊戯王などのカードを美しく飾るスタンド・ケースを販売しています。レーザーカット・3Dプリントで丁寧に製作。",
  keywords: ["カードディスプレイ", "トレカスタンド", "ポケカ", "遊戯王", "アクリルスタンド", "3Dプリント"],
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <Box sx={{ bgcolor: "white" }}>
      <HeroSection />
      <CategoryNavSection />
      <FeaturedProductsSection />
      <FeaturesSection />
      <CTASection />
    </Box>
  );
}
