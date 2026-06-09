import type { Metadata } from "next";
import AboutHero from "./_components/AboutHero";
import AboutStory from "./_components/AboutStory";
import AboutCollector from "./_components/AboutCollector";
import AboutValues from "./_components/AboutValues";
import AboutFeatures from "./_components/AboutFeatures";

export const metadata: Metadata = {
  title: "工房について",
  description:
    "飾Love は、MLBカードコレクターが営む小さな個人工房。レーザー加工と3Dプリントで、コレクターが本当に欲しいアクリルディスプレイを一つずつ手作りしています。",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutCollector />
      <AboutValues />
      <AboutFeatures />
    </>
  );
}
