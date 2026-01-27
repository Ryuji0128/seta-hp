import { Box } from "@mui/material";
import type { Metadata } from "next";
import HeroSection from "./_home/HeroSection";
import NewsSection from "./_home/NewsSection";
import ServicesSection from "./_home/ServicesSection";
import AboutSection from "./_home/AboutSection";
import TechStackSection from "./_home/TechStackSection";
import CTASection from "./_home/CTASection";

export const metadata: Metadata = {
  title: "瀬田製作所 | Web・モバイルアプリ開発",
  description:
    "瀬田製作所は、Webアプリケーションやモバイルアプリの開発を行うエンジニアチームです。React、Next.js、TypeScriptなどの先進技術で最適なソリューションを提供します。",
  keywords: ["Web開発", "アプリ開発", "React", "Next.js", "TypeScript", "瀬田製作所"],
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <Box>
      <HeroSection />
      <NewsSection />
      <ServicesSection />
      <AboutSection />
      <TechStackSection />
      <CTASection />
    </Box>
  );
}
