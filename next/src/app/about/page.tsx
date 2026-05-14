import type { Metadata } from "next";
import AboutHero from "./_components/AboutHero";
import AboutStory from "./_components/AboutStory";
import AboutValues from "./_components/AboutValues";
import AboutFeatures from "./_components/AboutFeatures";
import AboutLocation from "./_components/AboutLocation";

export const metadata: Metadata = {
  title: "工房について | 飾Love",
  description:
    "飾Loveは、カード好きが一人で運営する小さな工房です。富山県高岡市から、レーザー加工と3Dプリントで一つずつ手作りのアクリルディスプレイをお届けします。",
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
