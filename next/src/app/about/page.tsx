import type { Metadata } from "next";
import AboutHero from "./_components/AboutHero";
import AboutStory from "./_components/AboutStory";
import AboutValues from "./_components/AboutValues";
import AboutFeatures from "./_components/AboutFeatures";
import AboutLocation from "./_components/AboutLocation";

export const metadata: Metadata = {
  title: "工房について | 飾Love",
  description:
    "飾Loveは、MLBカードコレクターが一人で運営する富山県高岡市の小さな工房。レーザー加工と3Dプリントで一つずつ手作りのアクリルディスプレイをお届けします。",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutFeatures />
      <AboutLocation />
    </>
  );
}
